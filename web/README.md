## Chatspheres Front Door

Next.js 16 + Tailwind marketing/front-door for `chatspheres.com`. It renders the marketing site, Explore grid, pricing, moderation dashboards, Supabase-authenticated tools, and proxies several APIs that replace Xano.

### Stack
- Next.js App Router
- Supabase (auth, Postgres, realtime)
- Stripe (checkout + future portal)
- LiveKit wrapper (existing `sphere.chatspheres.com`)
- Netlify deploy (`netlify.toml` pins base/publish dirs)

### Local development
```bash
cd web
npm install
npm run dev
```

The site expects a required set of environment variables. Create `web/.env.local` based on the template below.

```bash
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_VIDEO_APP_URL=https://sphere.chatspheres.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
LIVEKIT_CONTROL_URL=https://your-controller-endpoint
LIVEKIT_CONTROL_API_KEY=sk_your_key
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_SPARK_PLUS_MONTHLY_PRICE=price_xxx
NEXT_PUBLIC_STRIPE_SPARK_PLUS_YEARLY_PRICE=price_xxx
NEXT_PUBLIC_STRIPE_ORBIT_MONTHLY_PRICE=price_xxx
NEXT_PUBLIC_STRIPE_ORBIT_YEARLY_PRICE=price_xxx
NEXT_PUBLIC_STRIPE_CONSTELLATION_MONTHLY_PRICE=price_xxx
NEXT_PUBLIC_STRIPE_CONSTELLATION_YEARLY_PRICE=price_xxx
NEXT_PUBLIC_SPARK_PRODUCT_ID=prod_xxx
SUPABASE_SERVICE_ROLE_KEY should NEVER be exposed to the browser (Next.js server only).
```

### Required Supabase setup
1. Run `supabase/policies.sql` inside the Supabase SQL editor. It:
   - Enables RLS on `user_stats`, `profiles`, `forum_members`, `video_rooms`, `match_requests`, and `moderation_logs`.
   - Adds `sphere_slug` + `room_slug` columns to `match_requests`.
   - Creates policies so authenticated users can submit matchmaking requests, moderators can read the queue/logs, and the service role can log actions.
2. Ensure the following tables/views exist (matching the LiveKit wrapper expectations):
   - `spheres`, `spheres_public_view`
   - `video_rooms`
   - `match_requests`
   - `moderation_logs`
   - `user_stats`, `profiles`
   - `recordings_public_view`, `metrics_public_view`
3. Realtime: enable Realtime on `match_requests` if moderators should see live queue updates (Settings → Database → Replication).

### Stripe checklist
1. Create products/prices for Spark+, Orbit, Constellation (monthly + yearly).
2. Set the `NEXT_PUBLIC_STRIPE_*_PRICE` env vars to the corresponding price IDs.
3. Configure `STRIPE_SECRET_KEY` (test or live) and optional Customer Portal domain (future enhancement).
4. When testing, run `npm run dev`, open `/pricing`, and trigger the upgrade buttons. Successful checkouts redirect back with `session_id`, and the server updates `user_stats.account_tier`.

### LiveKit controller hand-off
`/api/matchmaking/livekit` forwards matched participants to a control webhook. Provide:
- `LIVEKIT_CONTROL_URL`: HTTPS endpoint exposed by the controller (e.g., wrapper/server controller)
- `LIVEKIT_CONTROL_API_KEY`: Shared secret validated by the controller

### Replacing Xano
The following Next.js API routes already replace prior Xano endpoints:
| Route | Purpose |
| ----- | ------- |
| `api/spheres/search` | Explore search + slug lookup |
| `api/spheres/create` | Create new spheres (Supabase insert) |
| `api/spheres/last-hour` | Live stats ticker |
| `api/video/join` | Join/create video rooms (hand-off to LiveKit) |
| `api/matchmaking/*` | Queue, pair, and trigger LiveKit egress |
| `api/moderation/actions` | Log moderation actions |
| `api/billing/checkout` | Stripe Checkout sessions |

### Netlify deployment
- `netlify.toml` pins `base = "web"` and `publish = ".next"`.
- Set all environment variables in Netlify UI for both build + runtime contexts (see list above).
- Use `npm run build` during deploys.

### Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run lint` | ESLint |
| `npm run build` | Production build with Turbopack |

### Pending Items
- Populate Stripe price IDs in Netlify env.
- Deploy LiveKit control endpoint and supply `LIVEKIT_CONTROL_*` vars.
- Add Supabase `match_requests` column + RLS by running `supabase/policies.sql`.
- Final responsive QA + moderation polish per `app.ext`.
