# Baby Shower Invitation & Gift Registry

A warm, pastel single-page site: invitation + countdown, RSVP, and a live gift
registry where guests can pledge gifts (including partial pledges on
multi-quantity items like "5 sets of baby clothes").

## Quick start (local demo mode)

No setup required — pledges are stored in your own browser only (not shared
across guests yet).

```bash
npm install
npm run dev
```

Open the printed local URL. You'll see a small banner under the registry
heading confirming you're in local demo mode.

## Personalize the content

Edit [src/config.ts](src/config.ts) — parents' names, baby's name, date,
venue, theme, welcome message, and contact/footer text.

To change the gifts, edit [src/data/seedGifts.ts](src/data/seedGifts.ts)
(local mode) or the `gifts` table directly once Supabase is connected (see
below).

## Connect Supabase so pledges sync for every guest

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project's **SQL Editor**, paste and run the contents of
   [supabase/schema.sql](supabase/schema.sql). This creates the `gifts`,
   `pledges`, and `rsvps` tables, seeds the sample gift list, sets up Row
   Level Security, enables Realtime, and adds a server-side guard that
   blocks over-pledging even if two guests submit at the same instant.
   password: f3bR9dVNGygycCFb
3. In your project's **Settings → API**, copy the **Project URL** and
   **anon public** key.
4. Copy `.env.example` to `.env` and fill in both values:

   ```bash
   cp .env.example .env
   ```

5. Restart `npm run dev`. The local-demo banner disappears once Supabase is
   configured, and pledges now sync live across every guest's device via
   Supabase Realtime.

To edit the gift list later, use the Supabase Table Editor (or SQL) to
insert/update rows in `gifts` — no code changes needed.

## Deploy

Any static host that supports Vite works (Vercel, Netlify, etc.). Set the
same two `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment
variables in your hosting provider's project settings, then:

```bash
npm run build
```

Deploy the generated `dist/` folder.

## How the pledge logic works

Each gift has `quantityNeeded` and a running list of `pledges`
(`guestName`, `quantityPledged`, optional `note`). The UI sums pledges to
show progress, caps new pledges at the remaining amount, and once the total
reaches `quantityNeeded` the gift is marked "Blessed with love" and the
pledge form disappears. A soft (non-blocking) warning appears if the same
guest name pledges the same gift twice, in case a couple is contributing
together. Language throughout avoids "claimed/reserved/sold out" in favor of
warmer terms like "blessed."
# baby-shower-luna
