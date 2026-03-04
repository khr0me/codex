PASSI DA SEGUIRE:
Descrizione — contesto e obiettivo del progetto
• Requisiti funzionali — cosa deve fare l'applicazione
• Requisiti tecnici — stack, architettura e vincoli
• Schema database di partenza — tabelle e relazioni suggerite
• Consegne richieste — artefatti da produrre (codice, documentazione, API docs)
• Bonus — funzionalità opzionali per chi vuole andare oltre

# Sistema di Ticketing

Descrizione del Progetto
Un sistema di ticketing ispirato a strumenti come Jira o Zendesk, semplificato per il contesto
scolastico. Introduce il concetto di workflow a stati, assegnazione di task tra utenti e storico
delle comunicazioni.

# Requisiti Funzionali
• Apertura ticket da parte dell'utente: titolo, descrizione, categoria
(IT/Amministrativo/Altro), priorità
• Assegnazione ticket a un operatore da parte dell'admin
• Cambio stato del ticket: aperto → in lavorazione → in attesa risposta → chiuso
• Sistema di commenti/risposte per ogni ticket (thread di conversazione)
• Notifica via email quando il ticket cambia stato o riceve una risposta
• Dashboard admin: numero ticket aperti per categoria, operatori più carichi, tempo
medio di risoluzione
• Storico completo di ogni ticket con chi ha fatto cosa e quando

# Requisiti Tecnici
• Backend: PHP REST API
• Database: MySQL
• Frontend: a scelta
• Autenticazione con 3 ruoli: utente, operatore, admin
• Email con PHPMailer per le notifiche (obbligatorio per questo progetto)

# Consegne richieste
• Codice sorgente su Git
• Documentazione API
• Schema ER
• Diagramma degli stati del ticket (può essere un disegno)

# Funzionalità Bonus
• Allegati ai ticket (upload file)
• Sistema di valutazione operatore alla chiusura del ticket
• Dashboard con grafici (Chart.js)
• SLA: alert se un ticket resta aperto più di X ore



# IDEA: Codex
# Cos'è un Sistema di Gestione Asset IT (CMDB)

Un **Sistema di Gestione Asset IT** è un software che tiene traccia di **tutte le risorse tecnologiche di un’organizzazione**.

CMDB significa:

> **Configuration Management Database**

È un concetto centrale nei sistemi ITSM come ServiceNow o Jira Service Management.

Un sistema SLA (Service Level Agreement) in informatica è un ==accordo contrattuale formale tra un fornitore di servizi IT (interno o esterno) e un cliente finale, che definisce in modo misurabile il livello di servizio atteso, le prestazioni, le responsabilità e le sanzioni in caso di mancato rispetto==.


# 🚀 PROGETTO INTEGRATO

# Sistema ITSM con Ticketing + Gestione Asset IT (CMDB)

---

# DESCRIZIONE DEL PROGETTO

Realizzazione di una piattaforma web per la gestione interna dei servizi IT di un’organizzazione (azienda o scuola), composta da:

- Sistema di apertura e gestione ticket di supporto
- Sistema di gestione e tracciamento degli asset IT (CMDB) 
- Collegamento bidirezionale tra ticket e asset
- Workflow a stati configurabili
- Sistema SLA
- Dashboard analytics
- Audit log completo

Il sistema consente di:

- Gestire richieste di assistenza 
- Monitorare lo stato dell’infrastruttura IT
- Analizzare guasti ricorrenti 
- Pianificare manutenzione preventiva
- Tenere traccia delle relazioni tra componenti IT

---

# 🎯 OBIETTIVO DEL PROGETTO

Simulare una piattaforma ITSM (IT Service Management) reale, con:

- Gestione incidenti
- Tracciamento asset
- Storico manutenzioni
- Metriche di performance
- Controllo SLA

---

# 🧩 MODULI DEL SISTEMA

1. 🔐 Sistema Utenti e Ruoli (core)    
2. 🎫 Modulo Ticketing
3. 🖥 Modulo Asset Management (CMDB)
4. 📊 Dashboard e Analytics
5. 🔔 Sistema Notifiche
6. 📜 Audit Log

---

# REQUISITI FUNZIONALI


## 1️⃣ Sistema Utenti e Autenticazione

- Login con JWT
- Password hashata (bcrypt)
- 3 ruoli base:
    - Utente
    - Operatore IT        
    - Admin
- Possibilità di estendere con RBAC (permessi granulari)

---

## 2️⃣ Modulo Ticketing

### Apertura Ticket

L’utente può inserire:

- Titolo
    
- Descrizione
    
- Categoria (Hardware / Software / Rete / Altro)
    
- Priorità (Bassa / Media / Alta / Critica)
    
- Asset collegato (opzionale ma consigliato)
    

---

### Workflow Stati

Stati standard:

- Nuovo
    
- Assegnato
    
- In lavorazione
    
- In attesa utente
    
- Risolto
    
- Chiuso
    

Ogni cambio stato:

- Genera evento
    
- Registra timestamp
    
- Invia notifica
    

---

### Assegnazione

- Manuale (admin → operatore)
    
- Possibilità futura di assegnazione automatica
    

---

### Sistema Commenti

- Thread conversazione
    
- Commenti pubblici
    
- Commenti interni (visibili solo agli operatori)
    
- Timestamp e autore
    

---

### Storico Ticket

Ogni ticket deve registrare:

- Creazione
    
- Cambio stato
    
- Cambio priorità
    
- Cambio assegnazione
    
- Collegamento asset
    
- Chiusura
    

---

## 3️⃣ Modulo Asset Management (CMDB)

---

### Gestione Asset

Ogni asset deve avere:

- Nome identificativo
    
- Codice inventario
    
- Tipo (PC, Stampante, Server, Router…)
    
- Stato (Attivo / In manutenzione / Dismesso)
    
- Data acquisto
    
- Data fine garanzia
    
- Posizione fisica
    
- Utente assegnato (se presente)
    

---

### Relazioni Asset

Possibilità di collegare asset tra loro:

Esempio:

- Server → ospita → Applicazione
    
- PC → collegato a → Stampante
    

Tabella relazioni molti-a-molti.

---

### Collegamento Ticket ↔ Asset

Un ticket può essere:

- Collegato a 1 o più asset
    
- Visualizzare storico guasti dell’asset
    
- Visualizzare manutenzioni precedenti
    

---

### Manutenzione Asset

- Registrazione interventi
    
- Tipo manutenzione (correttiva / preventiva)
    
- Tecnico responsabile
    
- Costo stimato
    
- Note
    

---

## 4️⃣ Sistema SLA

Regole configurabili per:

- Priorità
    
- Categoria
    

Calcolo automatico:

- Tempo massimo risposta
    
- Tempo massimo risoluzione
    

Stati SLA:

- In tempo
    
- A rischio
    
- Violato
    

Escalation automatica email se violato.

---

## 5️⃣ Dashboard Admin

Visualizzazione:

### Ticket

- Numero ticket aperti
    
- Ticket per categoria
    
- Ticket per priorità
    
- Tempo medio risoluzione
    
- SLA rispettati %
    

### Asset

- Asset per tipo
    
- Asset con più guasti
    
- Asset prossimi a fine garanzia
    
- Costi manutenzione totali
    

Grafici con Chart.js.

---

## 6️⃣ Sistema Notifiche

Email tramite PHPMailer per:

- Nuovo ticket assegnato
    
- Cambio stato
    
- Commento ricevuto
    
- SLA in rischio
    
- SLA violato
    

Notifiche anche salvate nel database.

---

## 7️⃣ Audit Log Completo

Ogni azione genera record:

- Chi
    
- Cosa
    
- Quando
    
- Valore precedente
    
- Nuovo valore
    

Audit consultabile solo da admin.

---

# 🔹 REQUISITI TECNICI

---

## Backend

- PHP 8+
    
- Architettura REST API
    
- Pattern MVC
    
- Repository + Service Layer
    
- JWT Authentication
    
- Middleware autorizzazioni
    

---

## Database

- MySQL
    
- Foreign Key
    
- Indici su:
    
    - ticket status
        
    - asset id
        
    - priority
        
- Soft delete
    
- Timestamp automatici
    

---

## Frontend

A scelta:

- HTML + Bootstrap  
    oppure
    
- Vue / React
    

Responsive design obbligatorio.

---

## Email

- PHPMailer obbligatorio
    
- Template HTML per notifiche
    

---

## Sicurezza

- Password hash (bcrypt)
    
- Prepared statements (PDO)
    
- Validazione input
    
- Rate limiting login
    
- Protezione XSS base
    

---

# 🗄 PRINCIPALI TABELLE DATABASE

Core:

- users
    
- roles
    
- permissions
    
- notifications
    
- audit_logs
    

Ticket:

- tickets
    
- ticket_comments
    
- ticket_events
    
- ticket_asset (relazione)
    

CMDB:

- assets
    
- asset_types
    
- asset_status
    
- asset_relationships
    
- asset_maintenance
    

SLA:

- sla_rules
    

---

# 📦 CONSEGNE RICHIESTE

1. Codice sorgente su Git
    
2. Documentazione API completa
    
3. Schema ER dettagliato
    
4. Diagramma stati ticket
    
5. Diagramma relazioni asset
    
6. Diagramma architettura backend
    
7. Video demo 3–5 minuti
    
8. Script SQL creazione database
    
9. Seed dati di esempio
    

---

# ⭐ FUNZIONALITÀ BONUS (Per fare la differenza)

---

## 🔥 Livello 1 (Ottimo)

- Allegati ai ticket
    
- Filtro avanzato ticket
    
- Ricerca full-text
    
- Esportazione CSV
    
- Reminder automatico SLA
    

---

## 🔥🔥 Livello 2 (Molto Avanzato)

- Assegnazione automatica operatore
    
- Knowledge base integrata
    
- Ticket duplicati
    
- Notifiche in-app real-time
    
- Dashboard KPI operatore
    

---

## 🔥🔥🔥 Livello Tesi

- Sistema Incident → Problem → Change
    
- Predizione guasti asset (statistica semplice)
    
- Calcolo TCO (Total Cost of Ownership)
    
- Sistema tag dinamici
    
- Versioning asset configuration
    

---

# 🎓 COME PRESENTARLO ALL’ORALE

“Abbiamo sviluppato una piattaforma ITSM semplificata che integra la gestione dei ticket con una CMDB, consentendo la tracciabilità completa delle risorse IT e l’analisi strutturata degli incidenti.”

Questo suona professionale.

---

# 💎 RISULTATO FINALE

Non è più:

> Sistema ticket scolastico

È:

> Piattaforma ITSM con CMDB integrata

Livello:

- Portfolio serio
    
- Colloquio tecnico
    
- Progetto da 30 e lode











# Utenti e Ruoli
CREATE TABLE ruoli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descrizione TEXT,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruolo_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    attivo BOOLEAN DEFAULT TRUE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminato_il TIMESTAMP NULL,
    FOREIGN KEY (ruolo_id) REFERENCES ruoli(id)
);

CREATE INDEX idx_utenti_ruolo ON utenti(ruolo_id);
CREATE INDEX idx_utenti_email ON utenti(email);


# Tab Ticketing
CREATE TABLE stati_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    chiuso BOOLEAN DEFAULT FALSE
);

CREATE TABLE priorita_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tempo_risposta_ore INT NOT NULL,
    tempo_risoluzione_ore INT NOT NULL
);

CREATE TABLE categorie_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codice VARCHAR(20) UNIQUE NOT NULL,
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT,

    stato_id INT NOT NULL,
    priorita_id INT NOT NULL,
    categoria_id INT NOT NULL,

    creato_da INT NOT NULL,
    assegnato_a INT NULL,

    scadenza_risposta DATETIME,
    scadenza_risoluzione DATETIME,
    stato_sla ENUM('in_tempo','a_rischio','violato') DEFAULT 'in_tempo',

    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    chiuso_il DATETIME NULL,
    eliminato_il DATETIME NULL,

    FOREIGN KEY (stato_id) REFERENCES stati_ticket(id),
    FOREIGN KEY (priorita_id) REFERENCES priorita_ticket(id),
    FOREIGN KEY (categoria_id) REFERENCES categorie_ticket(id),
    FOREIGN KEY (creato_da) REFERENCES utenti(id),
    FOREIGN KEY (assegnato_a) REFERENCES utenti(id)
);

CREATE INDEX idx_ticket_stato ON ticket(stato_id);
CREATE INDEX idx_ticket_priorita ON ticket(priorita_id);
CREATE INDEX idx_ticket_assegnato ON ticket(assegnato_a);
CREATE INDEX idx_ticket_creato_da ON ticket(creato_da);

CREATE TABLE commenti_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    utente_id INT NOT NULL,
    commento TEXT NOT NULL,
    interno BOOLEAN DEFAULT FALSE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (utente_id) REFERENCES utenti(id)
);

CREATE INDEX idx_commenti_ticket ON commenti_ticket(ticket_id);

CREATE TABLE eventi_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    valore_precedente TEXT,
    valore_nuovo TEXT,
    modificato_da INT NOT NULL,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (modificato_da) REFERENCES utenti(id)
);



# Tab CMDB - ASSET (per tracciare tutte le risorse IT di un'organizzazione)

CREATE TABLE tipi_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE stati_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codice_inventario VARCHAR(100) UNIQUE NOT NULL,

    tipo_id INT NOT NULL,
    stato_id INT NOT NULL,

    data_acquisto DATE,
    fine_garanzia DATE,
    posizione VARCHAR(150),
    assegnato_a INT NULL,

    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminato_il TIMESTAMP NULL,

    FOREIGN KEY (tipo_id) REFERENCES tipi_asset(id),
    FOREIGN KEY (stato_id) REFERENCES stati_asset(id),
    FOREIGN KEY (assegnato_a) REFERENCES utenti(id)
);

CREATE INDEX idx_asset_tipo ON asset(tipo_id);
CREATE INDEX idx_asset_stato ON asset(stato_id);
CREATE INDEX idx_asset_utente ON asset(assegnato_a);

CREATE TABLE relazioni_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_padre INT NOT NULL,
    asset_figlio INT NOT NULL,
    tipo_relazione VARCHAR(100) NOT NULL,
    FOREIGN KEY (asset_padre) REFERENCES asset(id),
    FOREIGN KEY (asset_figlio) REFERENCES asset(id)
);

CREATE TABLE manutenzioni_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    tipo ENUM('correttiva','preventiva') NOT NULL,
    descrizione TEXT,
    tecnico_id INT NOT NULL,
    costo DECIMAL(10,2),
    data_intervento DATE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES asset(id),
    FOREIGN KEY (tecnico_id) REFERENCES utenti(id)
);

CREATE INDEX idx_manutenzioni_asset ON manutenzioni_asset(asset_id);


# Tab N-N (un ticket può riguardare **più asset** e un asset può essere coinvolto in più ticket)

CREATE TABLE ticket_asset (
    ticket_id INT NOT NULL,
    asset_id INT NOT NULL,
    PRIMARY KEY(ticket_id, asset_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES asset(id) ON DELETE CASCADE
);


# Tab Notifiche
CREATE TABLE notifiche (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utente_id INT NOT NULL,
    titolo VARCHAR(255) NOT NULL,
    messaggio TEXT NOT NULL,
    letta BOOLEAN DEFAULT FALSE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utente_id) REFERENCES utenti(id)
);

CREATE INDEX idx_notifiche_utente ON notifiche(utente_id);

# Tab Audit Log (per registrare tutto quello che accade nel sistema per sicurezza e tracciabilità)

CREATE TABLE log_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utente_id INT NOT NULL,
    entita VARCHAR(50) NOT NULL,
    entita_id INT NOT NULL,
    azione VARCHAR(50) NOT NULL,
    valore_precedente TEXT,
    valore_nuovo TEXT,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utente_id) REFERENCES utenti(id)
);

CREATE INDEX idx_log_entita ON log_sistema(entita, entita_id);



# Draw.io
[UTENTE] ──<crea>── [TICKET] ──<categoria>── [CATEGORIA]
    │             │
    │             └─<priorita>── [PRIORITA]
    │
    └─<assegnato_a>── [TICKET]
    │
    └─<riceve>── [NOTIFICA]

[TICKET] ──<collega>── [ASSET] ──<tipo>── [TIPO_ASSET]
                   │
                   └─<stato>── [STATO_ASSET]
                   │
                   └─<manutenzione>── [MANUTENZIONE]
                   │
                   └─<relazione>── [ASSET]


        [UTENTE] 
       /   |    \
      /    |     \
  assegna  crea   riceve
    /        \       \
[TICKET]  [TICKET]  [NOTIFICA]
   |   \
   |    \
stato_di  priorita_di / categoria_di
   |       |          |
[STATO] [PRIORITA] [CATEGORIA]
   |
ha_commento_evento
   |
[COMMENTO / EVENTO]

-----------------------------------
         [ASSET]
        /   |   \
     tipo_di stato_di
      |       |
 [TIPO_ASSET][STATO_ASSET]
      |
ha_manutenzione
      |
[MANUTENZIONE_ASSET]
      |
relazione_asset
      |
[ASSET]\