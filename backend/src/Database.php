<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $pdo = null;

    public static function getConnection(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $db   = getenv('DB_NAME') ?: 'eneba_clone';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        if ($port === '4000' || str_contains($host, 'tidbcloud.com')) {
            $options[PDO::MYSQL_ATTR_SSL_CA] = '/etc/ssl/certs/ca-certificates.crt';
        }

        $schemaFile = __DIR__ . '/../schema.sql';

        try {
            self::$pdo = new PDO("mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4", $user, $pass, $options);
        } catch (PDOException $e) {
            if ((int)($e->errorInfo[1] ?? 0) === 1049 && is_file($schemaFile)) {
                $bootstrap = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
                    PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => true,
                ]);
                $bootstrap->exec((string)file_get_contents($schemaFile));
                self::$pdo = new PDO("mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4", $user, $pass, $options);
            } else {
                throw $e;
            }
        }

        $hasTables = self::$pdo->query("SHOW TABLES LIKE 'products'")->fetch();
        if (!$hasTables && is_file($schemaFile)) {
            $sql = (string)file_get_contents($schemaFile);
            $sql = (string)preg_replace('/^\s*(CREATE\s+DATABASE|USE)\b[^;]*;/im', '', $sql);
            $seedOptions = $options;
            $seedOptions[PDO::ATTR_EMULATE_PREPARES] = true;
            $seedPdo = new PDO("mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4", $user, $pass, $seedOptions);
            $seedPdo->exec($sql);
        }

        return self::$pdo;
    }
}