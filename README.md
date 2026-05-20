This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Folder structure (flight booking app)

This repo is organized around a typical booking journey: **marketing → search → results → travelers → checkout**, plus **account/trips**.

- **`app/`**: Next.js App Router routes, layouts, and route groups.
  - **`app/layout.tsx`**: Root layout (header/footer) shared by all pages.
  - **`app/page.tsx`**: Landing page (currently includes a placeholder flight search form).
  - **`app/(marketing)/`**: Public, SEO-friendly pages that aren’t part of the checkout flow.
    - **`about/`**, **`contact/`**: Example informational pages (add `page.tsx` later).
  - **`app/(booking)/`**: The core flight booking funnel (route group does not affect the URL).
    - **`search/`**: Search form and query parsing (origin/destination/date/pax).
    - **`results/`**: Lists fares/itineraries; filters/sorting.
    - **`travellers/`**: Passenger details (names, docs, SSR, baggage, seats).
    - **`checkout/`**: Payment, confirmations, and final booking creation.
  - **`app/(account)/`**: Signed-in user experiences.
    - **`sign-in/`**, **`sign-up/`**: Authentication pages.
    - **`trips/`**: Upcoming/past bookings and itinerary details.
    - **`profile/`**: Traveler profile, saved passengers, preferences.

- **`components/`**: Reusable React components used across routes.
  - **`components/ui/`**: Generic UI building blocks (Button, Input, Card, Modal).
  - **`components/booking/`**: Booking-domain components (FlightCard, FareBreakdown).
  - **`components/account/`**: Account-domain components (TripCard, ProfileForm).

- **`services/`**: API client wrappers (how the frontend talks to your backend/external providers).
  - Example future modules: `flights.ts`, `airports.ts`, `bookings.ts`, `payments.ts`.

- **`types/`**: Shared TypeScript types/interfaces (Flight, Airport, Booking, Passenger).

- **`lib/`**: Cross-cutting utilities (date/price formatting, query helpers, fetch wrapper).

- **`hooks/`**: Reusable React hooks (e.g. `useDebounce`, `useSearchParamsState`).

- **`public/`**: Static assets served as-is (logos, icons, images).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
