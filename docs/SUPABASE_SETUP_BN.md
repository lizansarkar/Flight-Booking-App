# Supabase সেটআপ — ধাপে ধাপে (বাংলা)

এই গাইড SkyBooker প্রজেক্টের জন্য। কোড ইতিমধ্যে লেখা; তোমার কাজ মূলত **Supabase Dashboard** এ সেটআপ করা।

---

## ধাপ ১: Supabase প্রজেক্ট বানাও

1. [https://supabase.com](https://supabase.com) → লগইন → **New project**
2. নাম দাও, পাসওয়ার্ড সেভ করো, রিজিয়ন বেছে নাও
3. প্রজেক্ট **Ready** হওয়া পর্যন্ত অপেক্ষা (২–৫ মিনিট)

---

## ধাপ ২: API Keys কপি করো

1. Dashboard → **Project Settings** (গিয়ার) → **API**
2. কপি করো:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **service_role** key কখনো frontend / `.env.local` এ দিও না (শুধু সার্ভার, গোপন)

---

## ধাপ ৩: `.env.local` ফাইল

প্রজেক্ট রুটে `flight-booking-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- স্পেস বা কোটেশন ছাড়া লিখো
- সেভ করার পর **টার্মিনালে `Ctrl+C` → `npm run dev`** আবার চালাও

**চেক:** সাইটের উপরে হলুদ ব্যানার *"Supabase not configured"* থাকলে env ঠিক হয়নি বা dev server রিস্টার্ট করোনি।

---

## ধাপ ৪: Database টেবিল (SQL)

Dashboard → **SQL Editor** → New query → এক এক করে রান করো:

| ক্রম | ফাইল |
|------|------|
| ১ | `supabase/migrations/001_init.sql` |
| ২ | `supabase/migrations/002_add_pnr.sql` |
| ৩ (ঐচ্ছিক) | `supabase/seed_sample_flights.sql` |
| ৪ (সমস্যা হলে) | `supabase/fix_rls_public_read.sql` |

**চেক:** Table Editor → `flights`, `bookings`, `passengers`, `seats` দেখা যাচ্ছে কিনা।

---

## ধাপ ৫: Authentication (ইমেইল/পাসওয়ার্ড)

1. Dashboard → **Authentication** → **Providers**
2. **Email** চালু আছে কিনা দেখো
3. **Sign up** টেস্টের জন্য:
   - **Authentication** → **Settings** → *Confirm email* বন্ধ করলে দ্রুত টেস্ট হয় (অ্যাসাইনমেন্টের জন্য OK)
   - চালু থাকলে ইমেইলে কনফার্ম লিংক ক্লিক করতে হবে

**চেক:** সাইটে `/signup` → অ্যাকাউন্ট → `/login` → `/dashboard` ঢুকতে পারছো কিনা।

---

## ধাপ ৬: পুরো বুকিং ফ্লো টেস্ট

1. `http://localhost:3000/search`
2. Origin: `DAC`, Destination: `DXB`, Date: seed ফাইলের মতো **আজ থেকে ৭–১৪ দিন পরের** একটি তারিখ
3. ফলাফলে **Book** → `/booking/checkout`
4. লগইন না থাকলে লগইন করো
5. নাম + পাসপোর্ট → **Confirm booking**
6. `/booking/confirmation` এ **PNR** দেখা যাচ্ছে কিনা

**চেক:** Table Editor → `bookings` ও `passengers` এ নতুন row।

---

## সাধারণ সমস্যা ও সমাধান

| লক্ষণ | কারণ | সমাধান |
|--------|------|--------|
| হলুদ ব্যানার / Missing env | `.env.local` নেই বা খালি | ধাপ ২–৩ |
| Search এ কোনো ফ্লাইট নেই | seed চালানো হয়নি বা ভুল তারিখ | `seed_sample_flights.sql` + সঠিক date |
| Search error / permission denied | `flights` এ RLS ব্লক | `fix_rls_public_read.sql` রান করো |
| Sign up কাজ করে না | Email confirm চালু | Auth settings এ confirm বন্ধ বা ইমেইল কনফার্ম |
| Booking fail / RLS | লগইন নেই | আগে `/login` |
| `column pnr does not exist` | 002 migration রান হয়নি | `002_add_pnr.sql` রান করো |
| Booking insert fail | `001_init.sql` রান হয়নি | পুরো 001 আবার (নতুন প্রজেক্টে) |

---

## “১০০% পারফেক্ট” vs অ্যাসাইনমেন্ট

**ইন্টার্নশিপ অ্যাসাইনমেন্টের জন্য যা আছে তা যথেষ্ট:**
- Search, Auth, Checkout, PNR, DB, RLS, Zustand store

**আরও সময় থাকলে (পরবর্তী):**
- My Trips পেজ, সিট ম্যাপ checkout এ যুক্ত, পেমেন্ট স্টেপ, টেস্ট, ডিপ্লয়

---

## দ্রুত চেকলিস্ট

- [ ] `.env.local` দুই ভেরিয়েবল সেট
- [ ] `npm run dev` রিস্টার্ট
- [ ] SQL: 001 + 002 (+ seed)
- [ ] Email auth ON
- [ ] Signup + Login OK
- [ ] Search → Book → Checkout → PNR

সব টিক থাকলে Supabase অংশ **সম্পূর্ণ কাজ করছে**।
