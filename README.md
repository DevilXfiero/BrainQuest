# BrainQuest

A gamified second brain: capture notes, chat with them (RAG with citations), and earn XP and streaks
by reviewing AI-generated flashcards.

> Notes apps get abandoned. This one makes you want to come back.

**Status:** Week 1 of a 4-week build. The foundation is deployed; features are landing weekly.

- **Live app:** https://brain-quest-sable.vercel.app
- **API:** https://brainquest-api-isws.onrender.com/docs (free tier: the first request after idle can take ~1 minute)

## Stack

| Layer | Tech | Hosting |
|---|---|---|
| Web | Next.js (App Router), TypeScript, Tailwind, shadcn/ui | Vercel |
| API | FastAPI, Python 3.12, uv | Render |
| Data (coming) | Supabase: Postgres, pgvector, Auth | Supabase |

Everything runs on free tiers ($0/month). Details in [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Repo layout

```
apps/web     Next.js frontend
apps/api     FastAPI backend
infra/       Docker and deploy config
docs/        Plan, deployment notes, ADRs
```

## Run locally

Two terminals:

```bash
# API  -> http://localhost:8000
cd apps/api && cp .env.example .env && uv sync && uv run uvicorn main:app --reload

# Web  -> http://localhost:3000
cd apps/web && cp .env.example .env.local && npm install && npm run dev
```

See [`apps/api/README.md`](apps/api/README.md) and [`apps/web/README.md`](apps/web/README.md) for tests and lint.
