<?php
/**
 * POST /api/auth/login
 * Authenticate a user with email and password.
 */

$body = getJsonBody();
$email = $body['email'] ?? '';
$password = $body['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(['error' => 'Email and password are required'], 400);
}

$db = getTursoClient();

$user = $db->queryOne('SELECT * FROM users WHERE email = ? LIMIT 1', [strtolower($email)]);

if (!$user) {
    jsonResponse(['error' => 'Invalid email or password'], 401);
}

if (!password_verify($password, $user['password_hash'])) {
    jsonResponse(['error' => 'Invalid email or password'], 401);
}

jsonResponse([
    'id'    => $user['id'],
    'email' => $user['email'],
    'name'  => $user['name'],
    'role'  => $user['role'],
]);
