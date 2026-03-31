<?php
/**
 * GET /api/tickets/{id}/comments
 * List all comments for a ticket.
 * $ticketId is set by the router.
 */

$db = getTursoClient();

$rows = $db->query('SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC', [$ticketId]);

$result = array_map(function ($c) {
    return [
        'id'        => $c['id'],
        'ticketId'  => $c['ticket_id'],
        'authorId'  => $c['author_id'],
        'content'   => $c['content'],
        'internal'  => (bool)$c['internal'],
        'createdAt' => $c['created_at'],
    ];
}, $rows);

jsonResponse($result);
