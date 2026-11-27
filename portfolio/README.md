# Ahmed's portfolio

A responsive Next.js App Router portfolio built with TypeScript, Motion, and CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Before deployment, run:

```bash
npm run lint
npm run build
```

## Project structure

- `app/` — App Router entry point, metadata, and global styles
- `components/` — Portfolio sections, navigation, project previews, experience, and shared UI
- `hooks/` — Reusable scroll behavior
- `lib/portfolio.ts` — Navigation, project, and skills content
- `public/` — Static assets

Update the sample projects, skills, and experience entries in `lib/portfolio.ts`
with your own content. Company logos are stored in `public/experience/`.
Contact details and service descriptions are also configured in
`lib/portfolio.ts`. Visitors can email or call directly from the contact section.
The Blog navigation opens the public text-only blog at `/blog`. Publish articles
from the Blogs section in the admin dashboard; each post has a title,
description, SEO tags, a dedicated page, and generated structured metadata.

## Admin dashboard and Supabase

The private content dashboard is available at `/admin`; sign in at
`/admin/login`. It manages homepage/about copy, projects, experience, skills,
services, contact details, and blog posts. Only published records appear on the public site. Until Supabase
is configured, the public site continues to use its existing local content.

1. Create a Supabase project and copy its Project URL and publishable key.
2. Copy `.env.example` to `.env.local` and fill in those two values.
3. Run the latest `supabase/schema.sql`, then `supabase/seed.sql` in the
   Supabase SQL Editor. The schema can be re-run if its initial version was
   already applied; the seed fills the dashboard with the current content.
   If the existing database still rejects the `blogs` section, run
   `supabase/blog-migration.sql` in the SQL Editor.
4. In Supabase Authentication > Users, create your own user and set a strong
   password. Do not enable public sign-ups.
5. In the SQL Editor, run the final `admin_users` insert in `schema.sql` after
   replacing `you@example.com` with your user's email.
6. Restart the local dev server, then sign in at `http://localhost:3000/admin/login`.

## Cal.com free-call booking

The public sidebar's **Book a free call** button first collects a name, email,
and optional project note, then displays your Cal.com date/time picker inline
with those details pre-filled. Once a visitor confirms a time, Cal.com emails
the attendee and organizer according to the event's notification settings.
The booking appears in the protected `/admin/bookings` page through a signed
Cal.com webhook.

1. Copy `.env.example` to `.env.local` and set the Cal.com event URL, Supabase
   service-role key, and a long random webhook secret. Keep both secret values
   private and configure the same values in your hosting provider.
2. Run `supabase/calcom-bookings.sql` in the Supabase SQL Editor.
3. In Cal.com, add a webhook for booking created, rescheduled, and cancelled
   events. Set its subscriber URL to `https://YOUR_SITE/api/calcom/webhook`,
   use the same secret as `CALCOM_WEBHOOK_SECRET`, and enable attendee and
   organizer email notifications in the event settings.
4. Restart the app locally or redeploy after setting production environment
   variables. Bookings are visible to signed-in admins at `/admin/bookings`.

For the production site, set the Supabase project URL as the Supabase Auth
Site URL and allow `https://ahmedali-five.vercel.app/**` under Auth URL
Configuration. In Vercel, set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development,
then redeploy the latest deployment so the new environment settings are loaded.
The dashboard shares the portfolio deployment at
`https://ahmedali-five.vercel.app/admin`; no separate Vercel project is needed.

The app uses Supabase Auth sessions and checks the `admin_users` allowlist on
protected pages and every write action. Row Level Security limits public reads
to published records and admin writes to allowlisted users. Experience logos
can be uploaded to a public Supabase Storage bucket; only admins can upload or
remove files, and uploads are limited to verified image formats up to 5 MB.
No service-role key is needed by the app. For deployment, add the same two
environment variables to the hosting provider's protected environment settings.
