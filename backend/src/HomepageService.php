<?php
declare(strict_types=1);

class HomepageService {
    public function __construct(private PDO $pdo) {}

    public function getHero(): array {
        $hero = $this->fetchProducts("p.is_hero = 1")[0] ?? null;
        $upNext = $this->fetchProducts("p.is_up_next = 1");
        return ['hero' => $hero, 'upNext' => $upNext];
    }

    public function getBestsellers(): array {
        return $this->fetchProducts("p.is_bestseller = 1");
    }

    public function getDeals(): array {
        return $this->fetchProducts("p.is_deal = 1");
    }

    private function fetchProducts(string $where): array {
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
            WHERE {$where}
            GROUP BY p.id
            ORDER BY p.created_at ASC
        ";
        $rows = $this->pdo->query($sql)->fetchAll();
        return array_map([ProductService::class, 'formatProductRow'], $rows);
    }
}