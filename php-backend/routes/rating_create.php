<?php
/**
 * POST /api/tickets/{id}/rating
 * Rate a ticket (create or update rating).
 * $ticketId is set by the router.
 */

$body = getJsonBody();
$score   = $body['score'] ?? 0;
$userId  = $body['userId'] ?? 'anonymous';
$comment = $body['comment'] ?? null;

if (!$score || $score < 1 || $score > 5) {
    jsonResponse(['error' => 'Score must be between 1 and 5'], 400);
}

$db = getTursoClient();

// Check if user already rated this ticket
$existing = $db->queryOne('SELECT * FROM ratings WHERE ticket_id = ? AND user_id = ? LIMIT 1', [$ticketId, $userId]);

if ($existing) {
    // Update existing rating
    $db->execute('UPDATE ratings SET score = ?, comment = ? WHERE id = ?', [(int)$score, $comment, $existing['id']]);

    jsonResponse([
        'id'        => $existing['id'],
        'ticketId'  => $ticketId,
        'userId'    => $userId,
        'score'     => (int)$score,
        'comment'   => $comment,
        'createdAt' => $existing['created_at'],
    ]);
}

$id = generateUUID();
$createdAt = gmdate('Y-m-d\TH:i:s.v\Z');

$db->execute(
    'INSERT INTO ratings (id, ticket_id, user_id, score, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?)',
    [$id, $ticketId, $userId, (int)$score, $comment, $createdAt]
);

jsonResponse([
    'id'        => $id,
    'ticketId'  => $ticketId,
    'userId'    => $userId,
    'score'     => (int)$score,
    'comment'   => $comment,
    'createdAt' => $createdAt,
], 201);
