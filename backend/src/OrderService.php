<?php
declare(strict_types=1);

class OrderService {
    public function __construct(private PDO $pdo) {}

    public function checkout(int $userId, array $items, string $method): array {
        if (empty($items)) {
            throw new RuntimeException('Cart is empty');
        }
        $method = in_array($method, ['card', 'apple', 'crypto'], true) ? $method : 'card';

        $this->pdo->beginTransaction();
        try {
            $total = 0.0;
            $prepared = [];

            foreach ($items as $item) {
                $offerId = (int)($item['offer_id'] ?? 0);
                $qty = max(1, min(10, (int)($item['qty'] ?? 1)));

                $stmt = $this->pdo->prepare("
                    SELECT o.id, o.price, o.stock_count, o.product_id, s.name AS seller_name
                    FROM offers o
                    JOIN sellers s ON s.id = o.seller_id
                    WHERE o.id = :id FOR UPDATE
                ");
                $stmt->execute([':id' => $offerId]);
                $offer = $stmt->fetch();

                if (!$offer || $offer['stock_count'] < $qty) {
                    throw new RuntimeException("Offer #{$offerId} is out of stock");
                }

                $this->pdo->prepare("UPDATE offers SET stock_count = stock_count - :q WHERE id = :id")
                    ->execute([':q' => $qty, ':id' => $offerId]);

                $keys = [];
                for ($i = 0; $i < $qty; $i++) {
                    $keys[] = $this->generateDigitalKey();
                }

                $linePrice = (float)$offer['price'];
                $total += $linePrice * $qty;
                $prepared[] = [
                    'product_id'  => $offer['product_id'],
                    'seller_name' => $offer['seller_name'],
                    'price'       => $linePrice,
                    'qty'         => $qty,
                    'keys'        => $keys,
                ];
            }

            $orderId = 'ENB-' . random_int(10000, 99999);
            $total = round($total, 2);

            $this->pdo->prepare("INSERT INTO orders (id, user_id, total, method) VALUES (:id, :uid, :tot, :m)")
                ->execute([':id' => $orderId, ':uid' => $userId, ':tot' => $total, ':m' => $method]);

            $itemStmt = $this->pdo->prepare("
                INSERT INTO order_items (order_id, product_id, seller_name, price, qty, digital_keys)
                VALUES (:oid, :pid, :seller, :price, :qty, :keys)
            ");
            foreach ($prepared as $line) {
                $itemStmt->execute([
                    ':oid'    => $orderId,
                    ':pid'    => $line['product_id'],
                    ':seller' => $line['seller_name'],
                    ':price'  => $line['price'],
                    ':qty'    => $line['qty'],
                    ':keys'   => json_encode($line['keys']),
                ]);
            }

            $this->pdo->commit();
            return $this->getOrderById($userId, $orderId);
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function getUserOrders(int $userId): array {
        $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE user_id = :uid ORDER BY created_at DESC");
        $stmt->execute([':uid' => $userId]);
        $orders = $stmt->fetchAll();

        $out = [];
        foreach ($orders as $o) {
            $out[] = $this->hydrateOrder($o);
        }
        return $out;
    }

    public function getOrderById(int $userId, string $orderId): array {
        $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id AND user_id = :uid LIMIT 1");
        $stmt->execute([':id' => $orderId, ':uid' => $userId]);
        $order = $stmt->fetch();
        if (!$order) throw new RuntimeException('Order not found');
        return $this->hydrateOrder($order);
    }

    private function hydrateOrder(array $o): array {
        $stmt = $this->pdo->prepare("
            SELECT oi.*, p.*, oi.price AS line_price
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = :oid
        ");
        $stmt->execute([':oid' => $o['id']]);
        $lines = [];
        foreach ($stmt->fetchAll() as $row) {
            $row['price'] = (float)$row['line_price'];
            $lines[] = [
                'product' => ProductService::formatProductRow($row),
                'seller'  => $row['seller_name'],
                'price'   => (float)$row['line_price'],
                'qty'     => (int)$row['qty'],
                'keys'    => json_decode($row['digital_keys'], true) ?: [],
            ];
        }
        return [
            'id'     => $o['id'],
            'date'   => date('c', strtotime($o['created_at'])),
            'method' => $o['method'],
            'total'  => (float)$o['total'],
            'lines'  => $lines,
        ];
    }

    private function generateDigitalKey(): string {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $groups = [];
        for ($g = 0; $g < 3; $g++) {
            $seg = '';
            for ($i = 0; $i < 5; $i++) {
                $seg .= $chars[random_int(0, strlen($chars) - 1)];
            }
            $groups[] = $seg;
        }
        return implode('-', $groups);
    }
}