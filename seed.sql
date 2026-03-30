-- Seed data for HealthTicket database
-- SQL queries to populate demo data

-- Insert users (5 users with bcrypt placeholder hash)
-- Demo password for all seeded users: Password123!
-- Verified bcrypt hash: $2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW
INSERT INTO users (name, email, "passwordHash", role, "createdAt") VALUES
('Giovanni Rossi', 'giovanni.rossi@example.com', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'admin', datetime('now')),
('Maria Bianchi', 'maria.bianchi@example.com', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'operator', datetime('now')),
('Luca Verdi', 'luca.verdi@example.com', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now')),
('Sara Gialli', 'sara.gialli@example.com', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now')),
('Chiara Neri', 'chiara.neri@example.com', '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW', 'user', datetime('now'));

-- Insert tickets (4 tickets)
INSERT INTO tickets (subject, description, status, priority, category, "requesterId", "assigneeId", "createdAt", "updatedAt") VALUES
('Sistema di accesso non funziona', 'Non riesco ad accedere al portale con le mie credenziali. Ricevo errore 401.', 'open', 'high', 'technical', 3, 2, datetime('now', '-5 days'), datetime('now', '-5 days')),
('Richiesta di reset password', 'Ho dimenticato la password del mio account. Ho bisogno di un reset.', 'in-progress', 'medium', 'account', 4, 1, datetime('now', '-3 days'), datetime('now', '-1 day')),
('Pagina di caricamento lenta', 'La dashboard impiega troppo tempo per caricare i dati. Circa 30 secondi.', 'open', 'medium', 'technical', 5, null, datetime('now', '-2 days'), datetime('now', '-2 days')),
('Feature request: tema scuro', 'Sarebbe bello avere una modalità scura per usare l''app di notte.', 'closed', 'low', 'feature-request', 3, 2, datetime('now', '-10 days'), datetime('now', '-8 days'));

-- Insert comments (7 comments)
INSERT INTO comments (content, "ticketId", "userId", "isInternal", "createdAt") VALUES
('Ho verificato il ticket. Sembra un problema di autenticazione legato al session timeout.', 1, 2, 0, datetime('now', '-4 days')),
('Aggiunto il settore IT in assegnazione. Verranno investigate le credenziali domani mattina.', 1, 2, 1, datetime('now', '-4 days')),
('Accettato il reset password. Abbiamo inviato un link al suo indirizzo email.', 2, 1, 0, datetime('now', '-2 days')),
('Ricevuto e cliccato il link. Sono riuscito a cambiare la password con successo!', 2, 4, 0, datetime('now', '-1 day')),
('Problema risolto, grazie mille!', 2, 4, 0, datetime('now', '-1 day')),
('Abbiamo identificato il collo di bottiglia nel caricamento. È una query non ottimizzata nel database.', 3, 2, 1, datetime('now', '-1 day')),
('La feature tema scuro è stata sviluppata e resa disponibile nel rilascio v3.2. Grazie per il suggerimento!', 4, 1, 0, datetime('now', '-8 days'));

-- Insert ratings (2 ratings)
INSERT INTO ratings ("ticketId", "userId", score, comment, "createdAt") VALUES
(2, 4, 5, 'Assistenza fantastica, veloce e professionale!', datetime('now', '-10 hours')),
(4, 3, 4, 'Bella implementazione, era davvero necessaria', datetime('now', '-6 days'));

-- Insert ticket history (14 history entries - tracking all state changes)
INSERT INTO ticketHistory (action, "ticketId", "changedBy", details, "createdAt") VALUES
('Created', 1, 3, 'Ticket creato dall''utente Luca Verdi', datetime('now', '-5 days')),
('Assigned', 1, 1, 'Assegnato a Maria Bianchi (operator)', datetime('now', '-4 days', '2 hours')),
('Priority Changed', 1, 1, 'Priorità cambiata da medium a high', datetime('now', '-4 days', '1 hours')),
('Status Changed', 1, 2, 'Stato cambiato da open a in-progress', datetime('now', '-4 days')),
('Comment Added', 1, 2, 'Nuovo commento dell''operatore aggiunto', datetime('now', '-4 days')),
('Created', 2, 4, 'Ticket creato dall''utente Sara Gialli', datetime('now', '-3 days')),
('Assigned', 2, 1, 'Assegnato a Giovanni Rossi (admin)', datetime('now', '-2 days', '12 hours')),
('Status Changed', 2, 1, 'Stato cambiato da open a in-progress', datetime('now', '-2 days', '11 hours')),
('Comment Added', 2, 1, 'Nuovo commento dell''operatore aggiunto', datetime('now', '-2 days', '10 hours')),
('Status Changed', 2, 4, 'Stato cambiato da in-progress a closed', datetime('now', '-1 day')),
('Created', 3, 5, 'Ticket creato dall''utente Chiara Neri', datetime('now', '-2 days')),
('Created', 4, 3, 'Ticket creato dall''utente Luca Verdi', datetime('now', '-10 days')),
('Status Changed', 4, 2, 'Stato cambiato da open a closed', datetime('now', '-8 days')),
('Comment Added', 4, 1, 'Nuovo commento dell''operatore aggiunto', datetime('now', '-8 days'));
