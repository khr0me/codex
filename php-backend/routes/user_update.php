<?php
/**
 * PATCH /api/users/{userId}
 * Update user profile (name, email, password).
 * $userId is set by the router.
 *
 * Accepts JSON body: { currentPassword, name?, email?, newPassword? }
 */

$body = getJsonBody();
$db = getTursoClient();

$currentPassword = $body['currentPassword'] ?? '';

if (empty($currentPassword)) {
    jsonResponse(['error' => 'Current password is required'], 400);
}

// Fetch user
$user = $db->queryOne('SELECT * FROM users WHERE id = ? LIMIT 1', [$userId]);

if (!$user) {
    jsonResponse(['error' => 'User not found'], 404);
}

// Verify current password
if (!password_verify($currentPassword, $user['password_hash'])) {
    jsonResponse(['error' => 'Invalid current password'], 403);
}

$setClauses = [];
$params = [];

// Update name if provided
if (!empty($body['name'])) {
    $setClauses[] = 'name = ?';
    $params[] = $body['name'];
}

// Update email if provided
if (!empty($body['email'])) {
    $newEmail = strtolower($body['email']);
    // Check email is not taken by another user
    $emailCheck = $db->queryOne('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [$newEmail, $userId]);
    if ($emailCheck) {
        jsonResponse(['error' => 'Email is already taken by another user'], 409);
    }
    $setClauses[] = 'email = ?';
    $params[] = $newEmail;
}

// Update password if provided
if (!empty($body['newPassword'])) {
    $setClauses[] = 'password_hash = ?';
    $params[] = password_hash($body['newPassword'], PASSWORD_BCRYPT);
}

if (empty($setClauses)) {
    jsonResponse(['error' => 'No fields to update'], 400);
}

$params[] = $userId;
$sql = 'UPDATE users SET ' . implode(', ', $setClauses) . ' WHERE id = ?';
$db->execute($sql, $params);

// Fetch updated user
$updated = $db->queryOne('SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1', [$userId]);

jsonResponse([
    'id'        => $updated['id'],
    'email'     => $updated['email'],
    'name'      => $updated['name'],
    'role'      => $updated['role'],
    'createdAt' => $updated['created_at'],
]);
