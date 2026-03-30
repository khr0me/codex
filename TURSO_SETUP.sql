-- Complete Turso Database Setup for HealthTicket
-- Run these queries in order in Turso Studio

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" text NOT NULL DEFAULT 'user' CHECK("role" IN ('user', 'operator', 'admin')),
  "created_at" text NOT NULL
);

-- Tickets table
CREATE TABLE IF NOT EXISTS "tickets" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL DEFAULT 'Other' CHECK("category" IN ('IT', 'Administrative', 'Other')),
  "priority" text NOT NULL DEFAULT 'Medium' CHECK("priority" IN ('Low', 'Medium', 'High', 'Critical')),
  "status" text NOT NULL DEFAULT 'Open' CHECK("status" IN ('Open', 'In Progress', 'On Hold', 'Closed')),
  "requester_id" text NOT NULL,
  "assignee_id" text,
  "sla_hours" integer,
  "attachments" text,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL,
  FOREIGN KEY ("requester_id") REFERENCES "users"("id"),
  FOREIGN KEY ("assignee_id") REFERENCES "users"("id")
);

-- Comments table
CREATE TABLE IF NOT EXISTS "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "author_id" text NOT NULL,
  "content" text NOT NULL,
  "internal" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("author_id") REFERENCES "users"("id")
);

-- Ratings table
CREATE TABLE IF NOT EXISTS "ratings" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "user_id" text NOT NULL,
  "score" integer NOT NULL,
  "comment" text,
  "created_at" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Ticket History table
CREATE TABLE IF NOT EXISTS "ticket_history" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "action" text NOT NULL,
  "details" text NOT NULL,
  "user_id" text NOT NULL,
  "timestamp" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- ============================================
-- INSERT DEMO DATA
-- ============================================

-- Insert users (5 users)
-- Demo password for all seeded users: Password123!
-- Verified bcrypt hash for Password123!
INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES
('user-1', 'giovanni.rossi@example.com', 'Giovanni Rossi', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'admin', datetime('now')),
('user-2', 'maria.bianchi@example.com', 'Maria Bianchi', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'operator', datetime('now')),
('user-3', 'luca.verdi@example.com', 'Luca Verdi', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now')),
('user-4', 'sara.gialli@example.com', 'Sara Gialli', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now')),
('user-5', 'chiara.neri@example.com', 'Chiara Neri', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now'));

-- Insert tickets (4 tickets)
INSERT INTO "tickets" ("id", "title", "description", "status", "priority", "category", "requester_id", "assignee_id", "created_at", "updated_at") VALUES
('ticket-1', 'Sistema di accesso non funziona', 'Non riesco ad accedere al portale con le mie credenziali. Ricevo errore 401.', 'Open', 'High', 'IT', 'user-3', 'user-2', datetime('now', '-5 days'), datetime('now', '-5 days')),
('ticket-2', 'Richiesta di reset password', 'Ho dimenticato la password del mio account. Ho bisogno di un reset.', 'In Progress', 'Medium', 'IT', 'user-4', 'user-1', datetime('now', '-3 days'), datetime('now', '-1 day')),
('ticket-3', 'Pagina di caricamento lenta', 'La dashboard impiega troppo tempo per caricare i dati. Circa 30 secondi.', 'Open', 'Medium', 'IT', 'user-5', NULL, datetime('now', '-2 days'), datetime('now', '-2 days')),
('ticket-4', 'Feature request: tema scuro', 'Sarebbe bello avere una modalità scura per usare l''app di notte.', 'Closed', 'Low', 'Other', 'user-3', 'user-2', datetime('now', '-10 days'), datetime('now', '-8 days'));

-- Insert comments (7 comments)
INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES
('comment-1', 'ticket-1', 'user-2', 'Ho verificato il ticket. Sembra un problema di autenticazione legato al session timeout.', 0, datetime('now', '-4 days')),
('comment-2', 'ticket-1', 'user-2', 'Aggiunto il settore IT in assegnazione. Verranno investigate le credenziali domani mattina.', 1, datetime('now', '-4 days')),
('comment-3', 'ticket-2', 'user-1', 'Accettato il reset password. Abbiamo inviato un link al suo indirizzo email.', 0, datetime('now', '-2 days')),
('comment-4', 'ticket-2', 'user-4', 'Ricevuto e cliccato il link. Sono riuscito a cambiare la password con successo!', 0, datetime('now', '-1 day')),
('comment-5', 'ticket-2', 'user-4', 'Problema risolto, grazie mille!', 0, datetime('now', '-1 day')),
('comment-6', 'ticket-3', 'user-2', 'Abbiamo identificato il collo di bottiglia nel caricamento. È una query non ottimizzata nel database.', 1, datetime('now', '-1 day')),
('comment-7', 'ticket-4', 'user-1', 'La feature tema scuro è stata sviluppata e resa disponibile nel rilascio v3.2. Grazie per il suggerimento!', 0, datetime('now', '-8 days'));

-- Insert ratings (2 ratings)
INSERT INTO "ratings" ("id", "ticket_id", "user_id", "score", "comment", "created_at") VALUES
('rating-1', 'ticket-2', 'user-4', 5, 'Assistenza fantastica, veloce e professionale!', datetime('now', '-10 hours')),
('rating-2', 'ticket-4', 'user-3', 4, 'Bella implementazione, era davvero necessaria', datetime('now', '-6 days'));

-- Insert ticket history (14 history entries)
INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES
('history-1', 'ticket-1', 'Created', 'Ticket creato dall''utente Luca Verdi', 'user-3', datetime('now', '-5 days')),
('history-2', 'ticket-1', 'Assigned', 'Assegnato a Maria Bianchi (operator)', 'user-1', datetime('now', '-4 days', '2 hours')),
('history-3', 'ticket-1', 'Priority Changed', 'Priorità cambiata da Medium a High', 'user-1', datetime('now', '-4 days', '1 hours')),
('history-4', 'ticket-1', 'Status Changed', 'Stato cambiato da Open a In Progress', 'user-2', datetime('now', '-4 days')),
('history-5', 'ticket-1', 'Comment Added', 'Nuovo commento dell''operatore aggiunto', 'user-2', datetime('now', '-4 days')),
('history-6', 'ticket-2', 'Created', 'Ticket creato dall''utente Sara Gialli', 'user-4', datetime('now', '-3 days')),
('history-7', 'ticket-2', 'Assigned', 'Assegnato a Giovanni Rossi (admin)', 'user-1', datetime('now', '-2 days', '12 hours')),
('history-8', 'ticket-2', 'Status Changed', 'Stato cambiato da Open a In Progress', 'user-1', datetime('now', '-2 days', '11 hours')),
('history-9', 'ticket-2', 'Comment Added', 'Nuovo commento dell''operatore aggiunto', 'user-1', datetime('now', '-2 days', '10 hours')),
('history-10', 'ticket-2', 'Status Changed', 'Stato cambiato da In Progress a Closed', 'user-4', datetime('now', '-1 day')),
('history-11', 'ticket-3', 'Created', 'Ticket creato dall''utente Chiara Neri', 'user-5', datetime('now', '-2 days')),
('history-12', 'ticket-4', 'Created', 'Ticket creato dall''utente Luca Verdi', 'user-3', datetime('now', '-10 days')),
('history-13', 'ticket-4', 'Status Changed', 'Stato cambiato da Open a Closed', 'user-2', datetime('now', '-8 days')),
('history-14', 'ticket-4', 'Comment Added', 'Nuovo commento dell''operatore aggiunto', 'user-1', datetime('now', '-8 days'));
