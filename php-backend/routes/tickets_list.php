<?php
/**
 * GET /api/tickets
 * List all tickets ordered by creation date (newest first).
 */

$db = getTursoClient();

$rows = $db->query('SELECT * FROM tickets ORDER BY created_at DESC');

$result = array_map(function ($t) {
    $t['attachments'] = $t['attachments'] ? json_decode($t['attachments'], true) : [];
    $t['sla_hours'] = isset($t['sla_hours']) ? (int)$t['sla_hours'] : null;
    // Map snake_case DB columns to camelCase for frontend compatibility
    return [
        'id'          => $t['id'],
        'title'       => $t['title'],
        'description' => $t['description'],
        'category'    => $t['category'],
        'priority'    => $t['priority'],
        'status'      => $t['status'],
        'requesterId' => $t['requester_id'],
        'assigneeId'  => $t['assignee_id'],
        'slaHours'    => $t['sla_hours'],
        'attachments' => $t['attachments'],
        'createdAt'   => $t['created_at'],
        'updatedAt'   => $t['updated_at'],
    ];
}, $rows);

jsonResponse($result);
