# Seachan Quiz

Realtime quiz web app with QR room join.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Realtime)

## Fitur
- Host membuat room + QR code
- Player join via `/r/<ROOM_CODE>`
- Pertanyaan realtime dengan timer dan skor
- Global leaderboard Top 10

## Struktur Singkat
```txt
src/
  app/
  components/
  lib/
supabase/
  migrations/
  seed.sql
```
## Environment Variables
Copy `.env.example` ke `.env.local`, lalu isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HOST_LOGIN_USERNAME=
HOST_LOGIN_PASSWORD=
HOST_AUTH_SECRET=
```

## Run Local
```bash
npm install
npm run dev
```

port:
- `http://localhost:3000`
- `http://localhost:3000/host`
- `http://localhost:3000/leaderboard`

## Scripts
```bash
npm run dev
npm run build
npm run typecheck
```
