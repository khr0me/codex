<?php
/**
 * POST /api/tickets
 * Create a new ticket.
 */

$body = getJsonBody();
$db = getTursoClient();

$id = generateUUID();
$now = gmdate('Y-m-d\TH:i:s.v\Z');

$category = $body['category'] ?? 'Other';
$slaHours = match ($category) {
    'IT' => 24,
    'Administrative' => 48,
    default => 72,
};

$db->execute(
    'INSERT INTO tickets (id, title, description, category, priority, status, requester_id, attachments, sla_hours, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
        $id,
        $body['title'] ?? '',
        $body['description'] ?? '',
        $category,
        $body['priority'] ?? 'Medium',
        'Open',
        $body['requesterId'] ?? 'anonymous',
        json_encode($body['attachments'] ?? []),
        $slaHours,
        $now,
        $now,
    ]
);

// Insert history entry
$db->execute(
    'INSERT INTO ticket_history (id, ticket_id, action, details, user_id, timestamp)
     VALUES (?, ?, ?, ?, ?, ?)',
    [
        generateUUID(),
        $id,
        'Created',
        'Ticket created with priority ' . ($body['priority'] ?? 'Medium'),
        $body['requesterId'] ?? 'anonymous',
        $now,
    ]
);

jsonResponse([
    'id'          => $id,
    'title'       => $body['title'] ?? '',
    'description' => $body['description'] ?? '',
    'category'    => $category,
    'priority'    => $body['priority'] ?? 'Medium',
    'status'      => 'Open',
    'requesterId' => $body['requesterId'] ?? 'anonymous',
    'assigneeId'  => null,
    'slaHours'    => $slaHours,
    'attachments' => $body['attachments'] ?? [],
    'createdAt'   => $now,
    'updatedAt'   => $now,
], 201);
