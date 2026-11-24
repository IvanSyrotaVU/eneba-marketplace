<?php
declare(strict_types=1);

class ProductService {
    public function __construct(private PDO $pdo) {}

    public static function formatProductRow(array $r): array {
        return [
            'id'              => $r['id'],
            'title'           => $r['title'],
            'edition'         => $r['edition'] ?: null,
            'type'            => $r['type'],
            'preorder'        => (bool)$r['preorder'],
            'description'     => $r['description'],
            'cover'           => $r['cover'],
            'coverPosition'   => $r['cover_position'] ?: null,
            'platform'        => $r['platform'],
            'region'          => $r['region'],
            'price'           => (float)$r['price'],
            'oldPrice'        => (float)$r['old_price'],
            'cashback'        => $r['cashback'] !== null ? (float)$r['cashback'] : null,
            'claimed'         => $r['claimed'] !== null ? (int)$r['claimed'] : null,
            'featuredOfferId' => isset($r['featured_offer_id']) ? (int)$r['featured_offer_id'] : null,
        ];
    }

    public function listCatalog(array $params): array {
        $where = ["p.is_hero = 0"];
        $bindings = [];

        $cat = $params['cat'] ?? 'all';
        if ($cat === 'software') {
            $where[] = "p.type = 'Software'";
        } elseif ($cat === 'giftcards') {
            $where[] = "p.type = 'Gift Card'";
        } else {
            $where[] = "p.type NOT IN ('Software', 'Gift Card')";
        }

        if (!empty($params['platforms'])) {
            $list = explode(',', (string)$params['platforms']);
            $ph = [];
            foreach ($list as $i => $val) {
                $key = ":plat{$i}";
                $ph[] = $key;
                $bindings[$key] = trim($val);
            }
            $where[] = "p.platform IN (" . implode(',', $ph) . ")";
        }

        if (!empty($params['regions'])) {
            $list = explode(',', (string)$params['regions']);
            $ph = [];
            foreach ($list as $i => $val) {
                $key = ":reg{$i}";
                $ph[] = $key;
                $bindings[$key] = trim($val);
            }
            $where[] = "p.region IN (" . implode(',', $ph) . ")";
        }

        if (isset($params['min_price']) && $params['min_price'] !== '') {
            $where[] = "COALESCE(agg.lowest_price, p.old_price) >= :min_price";
            $bindings[':min_price'] = (float)$params['min_price'];
        }
        if (isset($params['max_price']) && $params['max_price'] !== '') {
            $where[] = "COALESCE(agg.lowest_price, p.old_price) <= :max_price";
            $bindings[':max_price'] = (float)$params['max_price'];
        }

        $orderBy = match ($params['sort'] ?? 'sort.popular') {
            'sort.low'      => 'price ASC',
            'sort.high'     => 'price DESC',
            'sort.discount' => '((p.old_price - price) / p.old_price) DESC',
            default         => 'p.is_bestseller DESC, p.created_at ASC',
        };

        $sql = "
            SELECT p.*,
                   COALESCE(agg.lowest_price, p.old_price) AS price,
                   agg.featured_offer_id
            FROM products p
            LEFT JOIN (
                SELECT o1.product_id, o1.price AS lowest_price, o1.id AS featured_offer_id
                FROM offers o1
                INNER JOIN (
                    SELECT product_id, MIN(price) AS min_price
                    FROM offers
                    WHERE stock_count > 0
                    GROUP BY product_id
                ) o2 ON o1.product_id = o2.product_id AND o1.price = o2.min_price
            ) agg ON agg.product_id = p.id
            WHERE " . implode(' AND ', $where) . "
            GROUP BY p.id
            ORDER BY {$orderBy}
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bindings);
        return array_map([self::class, 'formatProductRow'], $stmt->fetchAll());
    }

    public function search(string $query): array {
        $qClean = preg_replace('/[^a-z0-9 ]/', '', mb_strtolower(trim($query)));
        $qTokens = array_values(array_filter(explode(' ', $qClean)));
        if (empty($qTokens)) {
            return ['results' => [], 'corrected' => ''];
        }

        $all = $this->listCatalog(['cat' => 'all']);
        $scored = [];

        foreach ($all as $product) {
            $tClean = preg_replace('/[^a-z0-9 ]/', '', mb_strtolower($product['title']));
            $tTokens = array_values(array_filter(explode(' ', $tClean)));
            $total = 0.0;

            foreach ($qTokens as $q) {
                $best = 0.0;
                foreach ($tTokens as $t) {
                    $best = max($best, $this->tokenSim($q, $t));
                }
                $total += $best;
            }
            $score = $total / count($qTokens);
            if ($score >= 0.68) {
                $scored[] = ['product' => $product, 'score' => $score];
            }
        }

        usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);

        $correctedTokens = [];
        foreach ($qTokens as $q) {
            $bestT = $q;
            $bestS = 0.0;
            foreach ($scored as $item) {
                $tClean = preg_replace('/[^a-z0-9 ]/', '', mb_strtolower($item['product']['title']));
                foreach (explode(' ', $tClean) as $t) {
                    $s = $this->tokenSim($q, $t);
                    if ($s > $bestS) {
                        $bestS = $s;
                        $bestT = $t;
                    }
                }
            }
            $correctedTokens[] = $bestT;
        }
        $corrected = implode(' ', $correctedTokens);

        return [
            'results'   => array_slice(array_column($scored, 'product'), 0, 6),
            'corrected' => $corrected !== implode(' ', $qTokens) ? $corrected : '',
        ];
    }

    private function tokenSim(string $q, string $t): float {
        if ($q === '' || $t === '') return 0.0;
        if (str_starts_with($t, $q)) return 1.0;
        $prefix = substr($t, 0, strlen($q));
        $full = 1.0 - (levenshtein($q, $t) / max(strlen($q), strlen($t)));
        $pre  = 1.0 - (levenshtein($q, $prefix) / max(strlen($q), strlen($prefix)));
        return max($full, strlen($q) >= 4 ? $pre : 0.0);
    }

    public function getProductWithOffers(string $id): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) return null;

        $offerStmt = $this->pdo->prepare("
            SELECT o.id, o.price, s.name AS seller, s.rating, s.sales_label AS sales, s.hue
            FROM offers o
            JOIN sellers s ON s.id = o.seller_id
            WHERE o.product_id = :pid AND o.stock_count > 0
            ORDER BY o.price ASC
        ");
        $offerStmt->execute([':pid' => $id]);
        $offers = array_map(fn($o) => [
            'id'     => (int)$o['id'],
            'seller' => $o['seller'],
            'price'  => (float)$o['price'],
            'rating' => number_format((float)$o['rating'], 1),
            'sales'  => $o['sales'],
            'hue'    => (int)$o['hue'],
        ], $offerStmt->fetchAll());

        $row['price'] = $offers[0]['price'] ?? (float)$row['old_price'];
        $row['featured_offer_id'] = $offers[0]['id'] ?? null;
        $product = self::formatProductRow($row);
        $product['featuredOffer'] = $offers[0] ?? null;
        $product['otherOffers'] = array_slice($offers, 1);
        return $product;
    }
}