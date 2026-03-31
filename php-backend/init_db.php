<?php
/**
 * Initialize the Turso database with schema and demo data.
 * Usage: php php-backend/init_db.php
 */

require_once __DIR__ . '/config.php';

$db = getTursoClient();

echo "Creating tables...\n";

$db->execute('CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" text NOT NULL DEFAULT \'user\' CHECK("role" IN (\'user\', \'operator\', \'admin\')),
  "created_at" text NOT NULL
)');

$db->execute('CREATE TABLE IF NOT EXISTS "tickets" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL DEFAULT \'Other\' CHECK("category" IN (\'IT\', \'Administrative\', \'Other\')),
  "priority" text NOT NULL DEFAULT \'Medium\' CHECK("priority" IN (\'Low\', \'Medium\', \'High\', \'Critical\')),
  "status" text NOT NULL DEFAULT \'Open\' CHECK("status" IN (\'Open\', \'In Progress\', \'On Hold\', \'Closed\')),
  "requester_id" text NOT NULL,
  "assignee_id" text,
  "sla_hours" integer,
  "attachments" text,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL,
  FOREIGN KEY ("requester_id") REFERENCES "users"("id"),
  FOREIGN KEY ("assignee_id") REFERENCES "users"("id")
)');

$db->execute('CREATE TABLE IF NOT EXISTS "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "author_id" text NOT NULL,
  "content" text NOT NULL,
  "internal" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("author_id") REFERENCES "users"("id")
)');

$db->execute('CREATE TABLE IF NOT EXISTS "ratings" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "user_id" text NOT NULL,
  "score" integer NOT NULL,
  "comment" text,
  "created_at" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
)');

$db->execute('CREATE TABLE IF NOT EXISTS "ticket_history" (
  "id" text PRIMARY KEY NOT NULL,
  "ticket_id" text NOT NULL,
  "action" text NOT NULL,
  "details" text NOT NULL,
  "user_id" text NOT NULL,
  "timestamp" text NOT NULL,
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
)');

echo "Tables created.\n";

// Check if data already exists
$row = $db->queryOne('SELECT COUNT(*) as cnt FROM users');
if ($row && (int)$row['cnt'] > 0) {
    echo "Data already seeded ({$row['cnt']} users found). Skipping seed.\n";
    exit(0);
}

echo "Seeding demo data...\n";

// Demo password for all seeded users: Password123!
$passwordHash = '$2b$10$K6tiOB6U9Rq8M/NGgmcBO.cb2hTt9zVREkEdnFik6tRL8xamMKIuW';

$db->execute(
    'INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    ['user-1', 'giovanni.rossi@example.com', 'Giovanni Rossi', $passwordHash, 'admin']
);
$db->execute(
    'INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    ['user-2', 'maria.bianchi@example.com', 'Maria Bianchi', $passwordHash, 'operator']
);
$db->execute(
    'INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    ['user-3', 'luca.verdi@example.com', 'Luca Verdi', $passwordHash, 'user']
);
$db->execute(
    'INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    ['user-4', 'sara.gialli@example.com', 'Sara Gialli', $passwordHash, 'user']
);
$db->execute(
    'INSERT INTO "users" ("id", "email", "name", "password_hash", "role", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    ['user-5', 'chiara.neri@example.com', 'Chiara Neri', $passwordHash, 'user']
);

echo "Users seeded.\n";

// Tickets
$db->execute(
    'INSERT INTO "tickets" ("id", "title", "description", "status", "priority", "category", "requester_id", "assignee_id", "created_at", "updated_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\', \'-5 days\'), datetime(\'now\', \'-5 days\'))',
    ['ticket-1', 'Sistema di accesso non funziona', 'Non riesco ad accedere al portale con le mie credenziali. Ricevo errore 401.', 'Open', 'High', 'IT', 'user-3', 'user-2']
);
$db->execute(
    'INSERT INTO "tickets" ("id", "title", "description", "status", "priority", "category", "requester_id", "assignee_id", "created_at", "updated_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\', \'-3 days\'), datetime(\'now\', \'-1 day\'))',
    ['ticket-2', 'Richiesta di reset password', 'Ho dimenticato la password del mio account. Ho bisogno di un reset.', 'In Progress', 'Medium', 'IT', 'user-4', 'user-1']
);
$db->execute(
    'INSERT INTO "tickets" ("id", "title", "description", "status", "priority", "category", "requester_id", "assignee_id", "created_at", "updated_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\'), datetime(\'now\', \'-2 days\'))',
    ['ticket-3', 'Pagina di caricamento lenta', 'La dashboard impiega troppo tempo per caricare i dati. Circa 30 secondi.', 'Open', 'Medium', 'IT', 'user-5', null]
);
$db->execute(
    'INSERT INTO "tickets" ("id", "title", "description", "status", "priority", "category", "requester_id", "assignee_id", "created_at", "updated_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\', \'-10 days\'), datetime(\'now\', \'-8 days\'))',
    ['ticket-4', 'Feature request: tema scuro', 'Sarebbe bello avere una modalita\' scura per usare l\'app di notte.', 'Closed', 'Low', 'Other', 'user-3', 'user-2']
);

echo "Tickets seeded.\n";

// Comments
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\'))',
    ['comment-1', 'ticket-1', 'user-2', 'Ho verificato il ticket. Sembra un problema di autenticazione legato al session timeout.', 0]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\'))',
    ['comment-2', 'ticket-1', 'user-2', 'Aggiunto il settore IT in assegnazione. Verranno investigate le credenziali domani mattina.', 1]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\'))',
    ['comment-3', 'ticket-2', 'user-1', 'Accettato il reset password. Abbiamo inviato un link al suo indirizzo email.', 0]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-1 day\'))',
    ['comment-4', 'ticket-2', 'user-4', 'Ricevuto e cliccato il link. Sono riuscito a cambiare la password con successo!', 0]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-1 day\'))',
    ['comment-5', 'ticket-2', 'user-4', 'Problema risolto, grazie mille!', 0]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-1 day\'))',
    ['comment-6', 'ticket-3', 'user-2', 'Abbiamo identificato il collo di bottiglia nel caricamento. E\' una query non ottimizzata nel database.', 1]
);
$db->execute(
    'INSERT INTO "comments" ("id", "ticket_id", "author_id", "content", "internal", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-8 days\'))',
    ['comment-7', 'ticket-4', 'user-1', 'La feature tema scuro e\' stata sviluppata e resa disponibile nel rilascio v3.2. Grazie per il suggerimento!', 0]
);

echo "Comments seeded.\n";

// Ratings
$db->execute(
    'INSERT INTO "ratings" ("id", "ticket_id", "user_id", "score", "comment", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-10 hours\'))',
    ['rating-1', 'ticket-2', 'user-4', 5, 'Assistenza fantastica, veloce e professionale!']
);
$db->execute(
    'INSERT INTO "ratings" ("id", "ticket_id", "user_id", "score", "comment", "created_at") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-6 days\'))',
    ['rating-2', 'ticket-4', 'user-3', 4, 'Bella implementazione, era davvero necessaria']
);

echo "Ratings seeded.\n";

// Ticket history
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-5 days\'))',
    ['history-1', 'ticket-1', 'Created', 'Ticket creato dall\'utente Luca Verdi', 'user-3']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\', \'+2 hours\'))',
    ['history-2', 'ticket-1', 'Assigned', 'Assegnato a Maria Bianchi (operator)', 'user-1']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\', \'+1 hours\'))',
    ['history-3', 'ticket-1', 'Priority Changed', 'Priorita\' cambiata da Medium a High', 'user-1']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\'))',
    ['history-4', 'ticket-1', 'Status Changed', 'Stato cambiato da Open a In Progress', 'user-2']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-4 days\'))',
    ['history-5', 'ticket-1', 'Comment Added', 'Nuovo commento dell\'operatore aggiunto', 'user-2']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-3 days\'))',
    ['history-6', 'ticket-2', 'Created', 'Ticket creato dall\'utente Sara Gialli', 'user-4']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\', \'+12 hours\'))',
    ['history-7', 'ticket-2', 'Assigned', 'Assegnato a Giovanni Rossi (admin)', 'user-1']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\', \'+11 hours\'))',
    ['history-8', 'ticket-2', 'Status Changed', 'Stato cambiato da Open a In Progress', 'user-1']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\', \'+10 hours\'))',
    ['history-9', 'ticket-2', 'Comment Added', 'Nuovo commento dell\'operatore aggiunto', 'user-1']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-1 day\'))',
    ['history-10', 'ticket-2', 'Status Changed', 'Stato cambiato da In Progress a Closed', 'user-4']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-2 days\'))',
    ['history-11', 'ticket-3', 'Created', 'Ticket creato dall\'utente Chiara Neri', 'user-5']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-10 days\'))',
    ['history-12', 'ticket-4', 'Created', 'Ticket creato dall\'utente Luca Verdi', 'user-3']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-8 days\'))',
    ['history-13', 'ticket-4', 'Status Changed', 'Stato cambiato da Open a Closed', 'user-2']
);
$db->execute(
    'INSERT INTO "ticket_history" ("id", "ticket_id", "action", "details", "user_id", "timestamp") VALUES (?, ?, ?, ?, ?, datetime(\'now\', \'-8 days\'))',
    ['history-14', 'ticket-4', 'Comment Added', 'Nuovo commento dell\'operatore aggiunto', 'user-1']
);

echo "Demo data seeded successfully!\n";
echo "Users seeded: 5 (password for all: Password123!)\n";
echo "Tickets seeded: 4\n";
echo "Comments seeded: 7\n";
echo "Ratings seeded: 2\n";
echo "History entries seeded: 14\n";
