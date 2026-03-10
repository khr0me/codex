# API Documentation

This document outlines the REST endpoints used by the frontend. The backend may be implemented in PHP/MySQL or any other language; the paths below are referenced by the React app.

## Authentication

- `POST /api/auth/login` : { email, password } → { token, role }
- `POST /api/auth/logout` : invalidate token

## Tickets

- `GET /api/tickets` : list tickets visible to the current user
- `POST /api/tickets` : create new ticket
  - body: { title, description, category, priority, attachments? }
- `GET /api/tickets/{id}` : get ticket details + comments + history
- `PATCH /api/tickets/{id}` : update ticket (status, assignee, priority)
- `DELETE /api/tickets/{id}` : (admin) remove ticket

## Comments

- `POST /api/tickets/{id}/comments` : add comment
  - body: { content, internal? }

## Admin

- `GET /api/admin/stats` : return { ticketsByCategory, busiestOperators, meanResolutionHours }

## Users

- `GET /api/users` : list users (for assignment)
- `PATCH /api/users/{id}/role` : change role (admin only)
- `POST /api/users/{id}/rating` : record operator rating after ticket close

## Attachments

- `POST /api/uploads` : file upload endpoint; returns URL

## SLA alerts

- `GET /api/slas` : returns tickets that have breached hours


> All requests require an `Authorization: Bearer <token>` header unless otherwise noted.

For a detailed OpenAPI spec, generate using swagger tools or keep this as a reference.
