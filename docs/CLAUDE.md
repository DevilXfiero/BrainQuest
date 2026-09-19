# BrainQuest — Project Memory for Claude Code

A gamified "second brain" app: capture notes, chat with them via RAG, and earn XP/streaks by reviewing AI-generated flashcards.
This is a **portfolio project to get the owner hired**, built in ~4 weeks, deployed on **free tiers only**.

**Read `docs/PROJECT_CONTEXT.md` at the start of every session** for the full plan, scope, and decisions.

## Who I'm working with
- Owner is a **beginner in GenAI/RAG and DevOps**, and wants to *learn* while building.
- They must be able to explain every file in an interview. So:
  - **Plan first, then code.** Show a short plan and wait for approval before large edits.
  - **Small diffs.** One feature or task at a time.
  - **Explain the "why"** briefly for new concepts (embeddings, chunking, CI, Docker).
  - **RAG core logic (Week 3): the owner writes it.** Explain, review, and debug; don't write the whole pipeline unprompted.
  - After finishing a feature, offer 2-3 quiz questions on what was built.

## Tech stack
- Frontend: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, hosted on Vercel
- Backend: Python FastAPI, hosted on Render (Docker later, maybe Cloud Run)
- DB/Auth/Vectors: Supabase (Postgres + pgvector + Auth)
- LLM: Gemini or Groq free tier (Ollama for local dev); embeddings via local sentence-transformers or a free API
- CI/CD: GitHub Actions; Dependabot; Sentry/Langfuse later
- Migrations: Alembic

## Repo layout
```
apps/web     Next.js frontend
apps/api     FastAPI backend
infra/       Docker, deploy config
docs/        Architecture, ADRs, PROJECT_CONTEXT.md
.github/workflows/   CI/CD
```

## Commands (update as they become real)
- Web dev: `cd apps/web && npm run dev`
- Web lint: `cd apps/web && npm run lint`
- API dev: `cd apps/api && uvicorn main:app --reload`
- API tests: `cd apps/api && pytest`
- API lint: `cd apps/api && ruff check .`

## Conventions
- Python: type hints, Pydantic models for all request/response bodies, ruff formatting
- TypeScript: strict mode, no `any`
- Every new backend logic (XP, streaks, scheduling) gets **pytest tests**
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`), small commits, feature branches + PRs
- Notes content is **untrusted input** to the LLM (prompt-injection awareness)
- Every user-owned table must enforce per-user isolation (user_id checks / RLS)

## Hard rules
- **Never commit secrets.** Use `.env` (gitignored) and provide `.env.example`. Do not read or print `.env` contents.
- Stay within free tiers; ask before adding any paid service or dependency with cost.
- Don't add features outside the current week's scope (see docs/PROJECT_CONTEXT.md). If tempted, add a GitHub issue instead.
- If a task is stuck for more than ~1 hour, propose a simpler alternative.