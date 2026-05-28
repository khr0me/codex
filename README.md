# NetSolve

A network support ticketing system with user, operator, and admin interfaces.

---

## Requirements

Make sure you have installed:

- [Node.js](https://nodejs.org) v18 or later
- PHP v8.1 or later — on macOS: `brew install php`

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create a `.env.local` file** in the project root with your Turso credentials:

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

> Get these from your [Turso dashboard](https://app.turso.tech).

---

## Running the project

You need **two terminals open at the same time**.

**Terminal 1 — Backend:**

```bash
php -S localhost:8080 php-backend/index.php
```

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
