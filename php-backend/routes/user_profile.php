<?php
/**
 * GET /api/users/{userId}
 * Get user profile with their comments, ratings, and ticket count.
 * $userId is set by the router.
 */

$db = getTursoClient();

// Fetch user
$user = $db->queryOne('SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1', [$userId]);

if (!$user) {
    jsonResponse(['error' => 'User not found'], 404);
}

// Fetch comments by this user (joined with ticket title)
$comments = $db->query(
    'SELECT c.id, c.ticket_id, c.content, c.internal, c.created_at, t.title AS ticket_title
     FROM comments c
     LEFT JOIN tickets t ON t.id = c.ticket_id
     WHERE c.author_id = ?
     ORDER BY c.created_at DESC',
    [$userId]
);

$commentsMapped = array_map(function ($c) {
    return [
        'id'          => $c['id'],
        'ticketId'    => $c['ticket_id'],
        'ticketTitle' => $c['ticket_title'],
        'content'     => $c['content'],
        'internal'    => (bool)($c['internal'] ?? false),
        'createdAt'   => $c['created_at'],
    ];
}, $comments);

// Fetch ratings by this user (joined with ticket title)
$ratings = $db->query(
    'SELECT r.id, r.ticket_id, r.score, r.comment, r.created_at, t.title AS ticket_title
     FROM ratings r
     LEFT JOIN tickets t ON t.id = r.ticket_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC',
    [$userId]
);

$ratingsMapped = array_map(function ($r) {
    return [
        'id'          => $r['id'],
        'ticketId'    => $r['ticket_id'],
        'ticketTitle' => $r['ticket_title'],
        'score'       => (int)$r['score'],
        'comment'     => $r['comment'],
        'createdAt'   => $r['created_at'],
    ];
}, $ratings);

// Count tickets created by this user
$ticketCount = $db->queryOne('SELECT COUNT(*) AS cnt FROM tickets WHERE requester_id = ?', [$userId]);

jsonResponse([
    'user' => [
        'id'        => $user['id'],
        'email'     => $user['email'],
        'name'      => $user['name'],
        'role'      => $user['role'],
        'createdAt' => $user['created_at'],
    ],
    'comments'     => $commentsMapped,
    'ratings'      => $ratingsMapped,
    'ticketCount'  => (int)($ticketCount['cnt'] ?? 0),
]);
