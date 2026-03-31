<?php
/**
 * GET /api/tickets/{id}
 * Get a single ticket with its comments, history and rating.
 * $ticketId is set by the router.
 */

$db = getTursoClient();

// Fetch ticket
$ticketRow = $db->queryOne('SELECT * FROM tickets WHERE id = ? LIMIT 1', [$ticketId]);

if (!$ticketRow) {
    jsonResponse(['error' => 'Ticket not found'], 404);
}

$ticket = [
    'id'          => $ticketRow['id'],
    'title'       => $ticketRow['title'],
    'description' => $ticketRow['description'],
    'category'    => $ticketRow['category'],
    'priority'    => $ticketRow['priority'],
    'status'      => $ticketRow['status'],
    'requesterId' => $ticketRow['requester_id'],
    'assigneeId'  => $ticketRow['assignee_id'],
    'slaHours'    => isset($ticketRow['sla_hours']) ? (int)$ticketRow['sla_hours'] : null,
    'attachments' => $ticketRow['attachments'] ? json_decode($ticketRow['attachments'], true) : [],
    'createdAt'   => $ticketRow['created_at'],
    'updatedAt'   => $ticketRow['updated_at'],
];

// Fetch comments
$commentRows = $db->query('SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC', [$ticketId]);

$comments = array_map(function ($c) {
    return [
        'id'        => $c['id'],
        'ticketId'  => $c['ticket_id'],
        'authorId'  => $c['author_id'],
        'content'   => $c['content'],
        'internal'  => (bool)$c['internal'],
        'createdAt' => $c['created_at'],
    ];
}, $commentRows);

// Fetch history
$historyRows = $db->query('SELECT * FROM ticket_history WHERE ticket_id = ? ORDER BY timestamp ASC', [$ticketId]);

$history = array_map(function ($h) {
    return [
        'id'        => $h['id'],
        'ticketId'  => $h['ticket_id'],
        'action'    => $h['action'],
        'details'   => $h['details'],
        'userId'    => $h['user_id'],
        'timestamp' => $h['timestamp'],
    ];
}, $historyRows);

// Fetch rating
$ratingRow = $db->queryOne('SELECT * FROM ratings WHERE ticket_id = ? LIMIT 1', [$ticketId]);

if ($ratingRow) {
    $ticket['rating'] = (int)$ratingRow['score'];
    $ticket['ratingComment'] = $ratingRow['comment'];
}

jsonResponse([
    'ticket'   => $ticket,
    'comments' => $comments,
    'history'  => $history,
]);
