# Anna & Fluffy's Grooming

Website for Anna & Fluffy's Grooming built with Next.js, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Google Calendar appointment setup

The appointment UI is already wired to internal API routes:

- `GET /api/availability`
- `POST /api/appointments`

Without credentials, the site runs in demo mode. To connect a shared Google Calendar:

1. Create or choose the shared Google Calendar for salon appointments.
   - In the connected Google account, the editable calendar currently visible is `johnny.peirus@gmail.com`.
   - If you create a separate shared calendar for Anna & Fluffy's, use that calendar's ID instead.
2. Create a Google Cloud service account with Google Calendar API access.
3. Share the calendar with the service account email and grant permission to make changes.
4. Copy `.env.example` to `.env.local`.
5. Fill:

```bash
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Slots are generated from `openingWindows` in `data/site.ts`, from opening to closing time, using `calendarSettings.slotIntervalMinutes`. Existing events in the shared Google Calendar are treated as occupied.

## Editable content and Supabase

The admin panel at `/admin` edits:

- products
- services
- before/after gallery
- testimonials
- business contact details
- logo and uploaded images

In local development, content falls back to `data/content.json` when Supabase is not configured.
In production, use Supabase Free:

- Project: `anna-fluffys`
- Project ref: `nhuvnntwbqjlinntqmrz`
- URL: `https://nhuvnntwbqjlinntqmrz.supabase.co`
- Region: `eu-west-3`
- Storage bucket: `site-assets`

The schema is in `supabase/cms.sql` and has already been applied to the Supabase project. It creates:

- `public.site_content` for CMS JSON
- `site-assets` public storage bucket for uploaded images

Required environment variables:

```bash
ADMIN_PASSWORD=your-strong-admin-password
SUPABASE_URL=https://nhuvnntwbqjlinntqmrz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
SUPABASE_ASSETS_BUCKET=site-assets
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code and do not prefix it with `NEXT_PUBLIC_`.
