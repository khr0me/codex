<?php
/**
 * PATCH /api/tickets/{id}
 * Update ticket status, assignee, and/or priority.
 * $ticketId is set by the router.
 */

$body = getJsonBody();
$db = getTursoClient();

// Fetch existing ticket
$existing = $db->queryOne('SELECT * FROM tickets WHERE id = ? LIMIT 1', [$ticketId]);

if (!$existing) {
    jsonResponse(['error' => 'Ticket not found'], 404);
}

$now = gmdate('Y-m-d\TH:i:s.v\Z');
$setClauses = ['updated_at = ?'];
$params = [$now];
$historyEntries = [];

if (!empty($body['status']) && $body['status'] !== $existing['status']) {
    $setClauses[] = 'status = ?';
    $params[] = $body['status'];
    $historyEntries[] = [
        'action'  => 'Status Changed',
        'details' => $existing['status'] . ' → ' . $body['status'],
    ];
}

if (array_key_exists('assigneeId', $body) && $body['assigneeId'] !== $existing['assignee_id']) {
    $setClauses[] = 'assignee_id = ?';
    $params[] = $body['assigneeId'];
    $historyEntries[] = [
        'action'  => 'Assigned',
        'details' => 'Assigned to ' . ($body['assigneeId'] ?: 'unassigned'),
    ];
}

if (!empty($body['priority']) && $body['priority'] !== $existing['priority']) {
    $setClauses[] = 'priority = ?';
    $params[] = $body['priority'];
    $historyEntries[] = [
        'action'  => 'Priority Changed',
        'details' => $existing['priority'] . ' → ' . $body['priority'],
    ];
}

$params[] = $ticketId;
$sql = 'UPDATE tickets SET ' . implode(', ', $setClauses) . ' WHERE id = ?';
$db->execute($sql, $params);

// Insert history entries
foreach ($historyEntries as $entry) {
    $db->execute(
        'INSERT INTO ticket_history (id, ticket_id, action, details, user_id, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)',
        [
            generateUUID(),
            $ticketId,
            $entry['action'],
            $entry['details'],
            $body['userId'] ?? 'system',
            $now,
        ]
    );
}

// Return updated ticket
$updated = $db->queryOne('SELECT * FROM tickets WHERE id = ? LIMIT 1', [$ticketId]);

jsonResponse([
    'id'          => $updated['id'],
    'title'       => $updated['title'],
    'description' => $updated['description'],
    'category'    => $updated['category'],
    'priority'    => $updated['priority'],
    'status'      => $updated['status'],
    'requesterId' => $updated['requester_id'],
    'assigneeId'  => $updated['assignee_id'],
    'slaHours'    => isset($updated['sla_hours']) ? (int)$updated['sla_hours'] : null,
    'attachments' => $updated['attachments'] ? json_decode($updated['attachments'], true) : [],
    'createdAt'   => $updated['created_at'],
    'updatedAt'   => $updated['updated_at'],
]);
