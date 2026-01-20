# Marketplace Sénégal — Backend

## Stack
- Node.js + Express
- PostgreSQL
- Prisma ORM

## Lancer en local

### 1) Installer
```bash
cd backend
npm install

## Setup local (important)

1. Créer une base PostgreSQL locale (ex: marketplace)
2. Créer un fichier `backend/.env` à partir de `.env.example`
3. Lancer :
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev

