# SkyBooker — Flight Booking App
Live Link: [https://flight-booking-app-tau.vercel.app]

A frontend-focused technical assignment: a small flight search and booking experience built with Next.js and Supabase. The goal was to demonstrate a realistic user journey—search, select, sign in, enter passenger details, and confirm—while keeping scope manageable for an internship timeline.

---

## Project overview

SkyBooker is a demo flight booking web app. Users can search flights stored in Supabase, pick a result, sign in, submit passenger details, and receive a confirmation with a generated PNR (Passenger Name Record). The UI is built with React and Tailwind CSS; data and authentication are handled by Supabase (Postgres + Auth).

This project prioritizes **clear structure**, **typed TypeScript**, and **honest trade-offs** over production completeness. It is intended as a learning and review artifact, not a shipped product.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com) |
| Backend / DB | [Supabase](https://supabase.com) (Postgres, Row Level Security, Auth) |
| Auth integration | `@supabase/ssr` (cookie-based sessions for SSR) |
| Client state | [Zustand](https://zustand.docs.pmnd.rs) + `persist` middleware |
| Tooling | ESLint, Geist fonts via `next/font` |

---

## What is implemented

### Core user flow

1. **Landing** (`/`) — Marketing-style home with links into search.
2. **Flight search** (`/search`) — Origin, destination, and date form; results loaded from `public.flights` via server-side Supabase queries.
3. **Book** — Select a flight from results (stored in client state) and go to checkout.
4. **Authentication** (`/login`, `/signup`) — Email/password via Supabase Auth.
5. **Checkout** (`/booking/checkout`) — Passenger name and passport form; requires sign-in.
6. **Confirmation** (`/booking/confirmation`) — Displays fake PNR, flight summary, and passenger info after a successful booking.

### Backend (Supabase)

- SQL migrations for `flights`, `seats`, `bookings`, `passengers`, and a `pnr` column on bookings.
- **RLS** on `bookings` and `passengers` so users only access their own rows.
- Optional seed script for sample flights.

### Frontend architecture

- **Supabase clients** — Separate browser and server helpers; middleware refreshes sessions.
- **Route protection** — Middleware + server-side `getUser()` checks on protected routes (configurable in `lib/auth/paths.ts`).
- **Services layer** — `services/flights.ts`, `services/bookings.ts` for data access from server code.
- **Zustand booking store** — `selectedFlight`, `selectedSeat`, passenger fields; persisted to `localStorage` with **`partialize`** so passport number is **not** stored in the browser (only sent on submit to the server).
- **Seat map component** — Grid UI with select / occupied / selected states (demo-ready, not fully wired into checkout).
- **Resilience** — App can render without Supabase env vars (banner + graceful messages) so local setup mistakes are easier to debug.

### Routes (implemented)

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/search` | Flight search & results |
| `/login`, `/signup` | Auth |
| `/dashboard` | Signed-in placeholder |
| `/booking` | Zustand store demo |
| `/booking/checkout` | Passenger form & submit |
| `/booking/confirmation` | Post-booking summary |

---

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your project values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after changing env files.

### 3. Database setup

In the Supabase **SQL Editor**, run in order:

1. `supabase/migrations/001_init.sql` — tables + RLS policies  
2. `supabase/migrations/002_add_pnr.sql` — PNR column on bookings  
3. (Optional) `supabase/seed_sample_flights.sql` — sample rows for search  

Enable **Email** auth in Supabase if you use sign-up with confirmation.

Ensure the **anon** role can `select` on `flights` (and `seats` if you use real seat IDs). Adjust policies if your project defaults differ.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Suggested test path:** sign up → search (e.g. `DAC` / `DXB` on a seeded date) → **Book** → checkout → confirm → view PNR on confirmation page.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

---

## What is simplified (time constraints)

To deliver an end-to-end demo within a limited window, several areas were intentionally kept minimal:

- **No payment flow** — Bookings are marked `confirmed` without card processing or pricing rules.
- **Single passenger** — One name/passport per booking; no multi-traveler or infant logic.
- **Fake PNR** — Generated client-side pattern (e.g. `SKY` + random chars), not connected to any GDS or airline system.
- **No “My trips” UI** — Dashboard is a placeholder; booking history is in the database but not listed in the app.
- **Seat map not in the main funnel** — Component exists; checkout does not require picking a seat from live inventory (demo seat IDs are ignored unless they are real UUIDs from `seats`).
- **No automated tests** — Manual testing only.
- **No CI/CD or deployment docs** beyond standard Next.js assumptions.
- **Folder structure vs routes** — README-style route groups (`(marketing)`, `(account)/trips`, etc.) describe a target layout; only the routes in the table above are built.
- **Search matching** — `ilike` on origin/destination text, not airport autocomplete or IATA validation.
- **No realtime** — Seat availability is not subscribed via Supabase Realtime.

---

## Trade-offs

| Decision | Why | Cost |
|----------|-----|------|
| **Supabase + RLS** | Fast auth and Postgres without a custom API | Must understand policies; all writes need a logged-in user for bookings |
| **Server Actions / server modules** for booking | Keeps secrets off the client; fits App Router | Less visible than REST; harder to test without integration setup |
| **Zustand + `localStorage`** for in-progress booking | Simple cross-page state; survives refresh for flight/seat/name/DOB | Passport excluded from persist by design—user re-enters after reload; not ideal for multi-tab sync |
| **Middleware session refresh** | Recommended Supabase + Next.js pattern | Next.js 16 deprecates `middleware` in favor of `proxy`—may migrate later |
| **Tailwind utility classes** | Speed of styling | No shared design-system components yet |
| **Dynamic routes for checkout/confirmation** | Correct auth and DB reads at request time | No static prerender for those pages |

---

## What I would improve with more time

1. **Trips page** — List past bookings for the signed-in user with links to confirmation details.
2. **End-to-end seat selection** — Load seats per flight from Supabase, use `SeatMap` in checkout, block occupied seats on submit with a transaction or RPC.
3. **Stronger validation** — Zod schemas for forms; airport/date rules; duplicate booking prevention.
4. **Generated Supabase types** — `supabase gen types` for end-to-end type safety on queries.
5. **Tests** — Playwright for search → book → confirm; unit tests for PNR helper and store `partialize` behavior.
6. **Error and loading UX** — Toasts, skeletons, retry on failed Supabase calls.
7. **Accessibility** — Focus management on seat grid, form labels audit, keyboard-only booking path.
8. **Security hardening** — Rate limiting on booking action; audit RLS for `flights`/`seats` reads; consider not returning passport on confirmation UI.
9. **Migrate to Next.js `proxy`** — Replace deprecated middleware convention when upgrading docs/tooling.
10. **Payment stub** — Fake payment step before confirm to mirror a real checkout funnel.

---

## Project structure (actual)

```
app/                    # Routes (pages, layouts, server actions)
components/
  auth/                 # Login, signup, sign-out
  booking/              # Seat map, checkout form, store demo
lib/
  auth/                 # Protected route config
  supabase/             # Clients, middleware helper, env helpers
  booking/              # PNR generator
services/               # flights.ts, bookings.ts
stores/                 # Zustand booking store
types/                  # Flight & booking TypeScript types
supabase/migrations/    # SQL schema
middleware.ts           # Auth session + route guards
```

---

## Author note

This README describes what was built for a **frontend internship technical assignment**: a credible slice of a booking product with real auth and persistence, while being transparent about shortcuts. Feedback on architecture, security, and UX is welcome—I treated this as a portfolio piece as much as a deliverable.

---

## License

Private / assignment use unless otherwise specified by your program or employer.
