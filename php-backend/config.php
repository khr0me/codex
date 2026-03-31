<?php
/**
 * Database configuration for HealthTicket PHP backend.
 * Uses Turso HTTP Pipeline API for remote libSQL database.
 *
 * Set environment variables TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
 */

class TursoClient {
    private string $baseUrl;
    private string $authToken;

    public function __construct(string $url, string $token) {
        $this->baseUrl = str_replace('libsql://', 'https://', $url);
        $this->authToken = $token;
    }

    public function execute(string $sql, array $params = []): array {
        $args = [];
        foreach ($params as $p) {
            if ($p === null) {
                $args[] = ['type' => 'null', 'value' => null];
            } elseif (is_int($p)) {
                $args[] = ['type' => 'integer', 'value' => (string)$p];
            } else {
                $args[] = ['type' => 'text', 'value' => (string)$p];
            }
        }

        $payload = [
            'requests' => [
                ['type' => 'execute', 'stmt' => ['sql' => $sql, 'args' => $args]],
                ['type' => 'close']
            ]
        ];

        $ch = curl_init($this->baseUrl . '/v2/pipeline');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->authToken,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($httpCode !== 200) {
            throw new \RuntimeException("Turso HTTP error $httpCode: $response");
        }

        $data = json_decode($response, true);
        if (!$data || !isset($data['results'])) {
            throw new \RuntimeException("Invalid Turso response: $response");
        }

        return $data['results'][0]['response']['result'] ?? [];
    }

    public function query(string $sql, array $params = []): array {
        $result = $this->execute($sql, $params);
        $cols = array_map(fn($c) => $c['name'], $result['cols'] ?? []);
        $rows = [];
        foreach ($result['rows'] ?? [] as $row) {
            $assoc = [];
            foreach ($row as $i => $cell) {
                $assoc[$cols[$i]] = $cell['value'];
            }
            $rows[] = $assoc;
        }
        return $rows;
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }
}

function getTursoClient(): TursoClient {
    static $client = null;
    if ($client !== null) return $client;

    // Load .env.local if it exists
    $envFile = __DIR__ . '/../.env.local';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (str_contains($line, '=')) {
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                if (!getenv($key)) putenv("$key=$value");
            }
        }
    }

    $url = getenv('TURSO_DATABASE_URL') ?: '';
    $token = getenv('TURSO_AUTH_TOKEN') ?: '';

    if (empty($url) || empty($token)) {
        throw new \RuntimeException('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    }

    $client = new TursoClient($url, $token);
    return $client;
}

function generateUUID(): string {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    return is_array($body) ? $body : [];
}
