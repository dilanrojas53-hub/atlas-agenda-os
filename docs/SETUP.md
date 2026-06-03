# Setup Atlas Agenda OS

## Estado actual

El proyecto ya tiene una base funcional de frontend y una base SQL para Supabase.

## Frontend

```bash
npm install
npm run dev
```

## Variables

Copia `env.example` a `.env.local` y agrega los datos del proyecto Supabase nuevo.

```bash
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## Base de datos

Ejecutar los archivos SQL en este orden:

1. `supabase/schema/001_businesses.sql`
2. `supabase/schema/002_services.sql`
3. `supabase/schema/003_professionals.sql`
4. `supabase/schema/004_clients_appointments.sql`
5. `supabase/schema/005_payments_landing.sql`
6. `supabase/seed/001_demo_business.sql`
7. `supabase/seed/002_demo_services.sql`

## Regla importante

No usar el proyecto Supabase de SmartMenu para este prototipo. Crear un proyecto nuevo de Supabase para Atlas Agenda OS.
