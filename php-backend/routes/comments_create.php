<?php
/**
 * POST /api/tickets/{id}/comments
 * Add a comment to a ticket.
 * $ticketId is set by the router.
 */

$body = getJsonBody();
$content = $body['content'] ?? '';

if (empty(trim($content))) {
    jsonResponse(['error' => 'Content is required'], 400);
}

$db = getTursoClient();

$id = generateUUID();
$authorId = $body['authorId'] ?? 'anonymous';
$internal = !empty($body['internal']) ? 1 : 0;
$createdAt = gmdate('Y-m-d\TH:i:s.v\Z');

$db->execute(
    'INSERT INTO comments (id, ticket_id, author_id, content, internal, created_at)
     VALUES (?, ?, ?, ?, ?, ?)',
    [$id, $ticketId, $authorId, trim($content), $internal, $createdAt]
);

jsonResponse([
    'id'        => $id,
    'ticketId'  => $ticketId,
    'authorId'  => $authorId,
    'content'   => trim($content),
    'internal'  => (bool)$internal,
    'createdAt' => $createdAt,
], 201);
