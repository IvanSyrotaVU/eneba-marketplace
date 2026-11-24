<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Auth.php';
require_once __DIR__ . '/../src/HomepageService.php';
require_once __DIR__ . '/../src/ProductService.php';
require_once __DIR__ . '/../src/OrderService.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$flags  = JSON_UNESCAPED_SLASHES;

try {
    $pdo = Database::getConnection();
    $homepage = new HomepageService($pdo);
    $products = new ProductService($pdo);
    $orders   = new OrderService($pdo);

    // Modular Homepage Blocks (each backed by its own service query)
    if ($method === 'GET' && $path === '/api/homepage/hero') {
        echo json_encode($homepage->getHero(), $flags);
    } elseif ($method === 'GET' && $path === '/api/homepage/bestsellers') {
        echo json_encode($homepage->getBestsellers(), $flags);
    } elseif ($method === 'GET' && $path === '/api/homepage/deals') {
        echo json_encode($homepage->getDeals(), $flags);

        // Store Catalog & Fuzzy Search
    } elseif ($method === 'GET' && $path === '/api/products') {
        echo json_encode($products->listCatalog($_GET), $flags);
    } elseif ($method === 'GET' && $path === '/api/search') {
        echo json_encode($products->search((string)($_GET['q'] ?? '')), $flags);
    } elseif ($method === 'GET' && preg_match('#^/api/products/([^/]+)$#', $path, $m)) {
        $item = $products->getProductWithOffers($m[1]);
        if (!$item) { http_response_code(404); echo json_encode(['error' => 'Product not found']); exit; }
        echo json_encode($item, $flags);

        // Auth
    } elseif ($method === 'POST' && $path === '/api/auth/register') {
        $email    = strtolower(trim((string)($body['email'] ?? '')));
        $password = (string)($body['password'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid email and 6+ char password required']);
            exit;
        }
        $username = explode('@', $email)[0];
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (:u, :e, :p)");
        $stmt->execute([':u' => $username, ':e' => $email, ':p' => password_hash($password, PASSWORD_DEFAULT)]);
        $user = ['id' => (int)$pdo->lastInsertId(), 'username' => $username, 'email' => $email];
        echo json_encode(['token' => Auth::generateToken($user), 'user' => $user], $flags);

    } elseif ($method === 'POST' && $path === '/api/auth/login') {
        $email    = strtolower(trim((string)($body['email'] ?? '')));
        $password = (string)($body['password'] ?? '');
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :e LIMIT 1");
        $stmt->execute([':e' => $email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            exit;
        }
        unset($user['password_hash']);
        echo json_encode(['token' => Auth::generateToken($user), 'user' => $user], $flags);

    } elseif ($method === 'POST' && $path === '/api/auth/demo') {
        $stmt = $pdo->query("SELECT id, username, email FROM users WHERE email = 'demo@eneba.gg' LIMIT 1");
        $user = $stmt->fetch();
        echo json_encode(['token' => Auth::generateToken($user), 'user' => $user], $flags);

        // Protected Checkout & Order History
    } elseif ($method === 'POST' && $path === '/api/checkout') {
        $user = Auth::requireUser();
        $result = $orders->checkout((int)$user['sub'], $body['items'] ?? [], (string)($body['method'] ?? 'card'));
        echo json_encode($result, $flags);

    } elseif ($method === 'GET' && $path === '/api/orders') {
        $user = Auth::requireUser();
        echo json_encode($orders->getUserOrders((int)$user['sub']), $flags);

    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}