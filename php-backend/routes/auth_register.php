<?php
/**
 * POST /api/auth/register
 * Register a new user account.
 */

$body = getJsonBody();
$email    = $body['email'] ?? '';
$password = $body['password'] ?? '';
$name     = $body['name'] ?? '';

if (empty($email) || empty($password) || empty($name)) {
    jsonResponse(['error' => 'Email, password and name are required'], 400);
}

$db = getTursoClient();

// Check for existing user
$existing = $db->queryOne('SELECT id FROM users WHERE email = ? LIMIT 1', [strtolower($email)]);
if ($existing) {
    jsonResponse(['error' => 'An account with this email already exists'], 409);
}

$id = generateUUID();
$passwordHash = password_hash($password, PASSWORD_BCRYPT);
$createdAt = gmdate('Y-m-d\TH:i:s.v\Z');

$db->execute(
    'INSERT INTO users (id, email, name, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?)',
    [$id, strtolower($email), $name, $passwordHash, 'user', $createdAt]
);

jsonResponse([
    'id'    => $id,
    'email' => strtolower($email),
    'name'  => $name,
    'role'  => 'user',
], 201);
