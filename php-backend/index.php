<?php
/**
 * HealthTicket PHP Backend - Main Router
 * 
 * Routes all API requests to the appropriate handler.
 * Run with: php -S localhost:8080 php-backend/index.php
 */

// Suppress PHP warnings/notices from appearing as HTML in JSON responses
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '0');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove trailing slash
$uri = rtrim($uri, '/');

// Route matching
if ($uri === '/api/auth/login' && $method === 'POST') {
    require __DIR__ . '/routes/auth_login.php';
} elseif ($uri === '/api/auth/register' && $method === 'POST') {
    require __DIR__ . '/routes/auth_register.php';
} elseif ($uri === '/api/tickets' && $method === 'GET') {
    require __DIR__ . '/routes/tickets_list.php';
} elseif ($uri === '/api/tickets' && $method === 'POST') {
    require __DIR__ . '/routes/tickets_create.php';
} elseif (preg_match('#^/api/tickets/([^/]+)/comments$#', $uri, $matches)) {
    $ticketId = $matches[1];
    if ($method === 'GET') {
        require __DIR__ . '/routes/comments_list.php';
    } elseif ($method === 'POST') {
        require __DIR__ . '/routes/comments_create.php';
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} elseif (preg_match('#^/api/tickets/([^/]+)/rating$#', $uri, $matches)) {
    $ticketId = $matches[1];
    if ($method === 'POST') {
        require __DIR__ . '/routes/rating_create.php';
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} elseif (preg_match('#^/api/tickets/([^/]+)$#', $uri, $matches)) {
    $ticketId = $matches[1];
    if ($method === 'GET') {
        require __DIR__ . '/routes/tickets_get.php';
    } elseif ($method === 'PATCH') {
        require __DIR__ . '/routes/tickets_update.php';
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} elseif (preg_match('#^/api/users/([^/]+)$#', $uri, $matches)) {
    $userId = $matches[1];
    if ($method === 'GET') {
        require __DIR__ . '/routes/user_profile.php';
    } elseif ($method === 'PATCH') {
        require __DIR__ . '/routes/user_update.php';
    } elseif ($method === 'DELETE') {
        require __DIR__ . '/routes/user_delete.php';
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} else {
    jsonResponse(['error' => 'Not found'], 404);
}
