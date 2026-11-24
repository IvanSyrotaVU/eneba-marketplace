<?php
declare(strict_types=1);

class Auth {
    private static function secret(): string {
        return getenv('JWT_SECRET') ?: 'eneba_dev_secret_change_in_prod';
    }

    public static function generateToken(array $user): string {
        $header = rtrim(strtr(base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])), '+/', '-_'), '=');
        $payload = rtrim(strtr(base64_encode(json_encode([
            'sub'      => $user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'exp'      => time() + 86400 * 7
        ])), '+/', '-_'), '=');
        $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", self::secret(), true)), '+/', '-_'), '=');
        return "$header.$payload.$sig";
    }

    public static function requireUser(): array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required']);
            exit;
        }
        $parts = explode('.', $matches[1]);
        if (count($parts) !== 3) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
            exit;
        }
        [$header, $payload, $sig] = $parts;
        $expected = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", self::secret(), true)), '+/', '-_'), '=');
        if (!hash_equals($expected, $sig)) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token signature']);
            exit;
        }
        $data = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
        if (!$data || ($data['exp'] ?? 0) < time()) {
            http_response_code(401);
            echo json_encode(['error' => 'Token expired']);
            exit;
        }
        return $data;
    }
}