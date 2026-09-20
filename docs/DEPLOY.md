# Deployment

Free tiers only. Checked 2026-09-20.

| Piece | Host | Limits that matter |
|---|---|---|
| Web (`apps/web`) | Vercel Hobby | Free, non-commercial use only; 100 deploys/day |
| API (`apps/api`) | Render free web service | 750 instance hrs/month; sleeps after 15 min idle, ~1 min to wake |

## Render (API)

Create a **Web Service** from the GitHub repo with these settings:

| Setting | Value |
|---|---|
| Language / runtime | Python 3 |
| Branch | `main` |
| Root Directory | `apps/api` |
| Build Command | `pip install uv && uv export --frozen --no-dev --no-hashes --no-emit-project -o requirements.txt && pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |
| Instance type | Free |
| Auto-Deploy | On (deploys on every push to `main`) |

Environment variables:

| Key | Value |
|---|---|
| `PYTHON_VERSION` | `3.12.14` (Render's default is 3.14, so this must be pinned; needs full x.y.z) |
| `FRONTEND_ORIGIN` | The Vercel production URL, no trailing slash |

Why the build command exports a requirements file: `uv.lock` stays the single source of truth, and Render
can then use plain `pip`. The export leaves out dev tools (pytest, ruff).

## Vercel (Web)

Import the GitHub repo as a new project:

| Setting | Value |
|---|---|
| Framework Preset | Next.js (auto-detected) |
| Root Directory | `apps/web` |
| Environment variable | `NEXT_PUBLIC_API_URL` = the Render URL, no trailing slash |

`NEXT_PUBLIC_*` values are inlined at **build time**. Changing one later requires a redeploy.

## Order matters (each side needs the other's URL)

1. Deploy the API on Render with `FRONTEND_ORIGIN=http://localhost:3000` for now.
2. Deploy the web app on Vercel with `NEXT_PUBLIC_API_URL` set to the Render URL.
3. Set `FRONTEND_ORIGIN` on Render to the Vercel production URL (this redeploys the API).
4. Open the Vercel URL and confirm it says `API status: ok`.

Only the production domain is allowed by CORS. Vercel preview URLs will show "API unreachable".

## Keep the API awake

Add an UptimeRobot HTTP monitor on `<render-url>/health` (5-minute interval) so the free instance rarely sleeps.

## Live URLs

- Web: _fill in after deploy_
- API: _fill in after deploy_
