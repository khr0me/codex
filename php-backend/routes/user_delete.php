<?php
/**
 * DELETE /api/users/{userId}
 * Delete a user account and cascade-delete their related data.
 * $userId is set by the router.
 *
 * Accepts JSON body: { password }
 */

$body = getJsonBody();
$db = getTursoClient();

$password = $body['password'] ?? '';

if (empty($password)) {
    jsonResponse(['error' => 'Password is required'], 400);
}

// Fetch user
$user = $db->queryOne('SELECT * FROM users WHERE id = ? LIMIT 1', [$userId]);

if (!$user) {
    jsonResponse(['error' => 'User not found'], 404);
}

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    jsonResponse(['error' => 'Invalid password'], 403);
}

// Cascade delete: comments by this user
$db->execute('DELETE FROM comments WHERE author_id = ?', [$userId]);

// Cascade delete: ratings by this user
$db->execute('DELETE FROM ratings WHERE user_id = ?', [$userId]);

// Cascade delete: ticket_history entries by this user
$db->execute('DELETE FROM ticket_history WHERE user_id = ?', [$userId]);

// Delete the user
$db->execute('DELETE FROM users WHERE id = ?', [$userId]);

jsonResponse(['success' => true]);
