# BrainQuest — Full Project Context

(Summary of the planning conversation. Claude Code: treat this as the source of truth for scope and decisions.)

## 1. Goal and constraints
- Build a resume-worthy, **deployed** project to get hired as a software engineer.
- Roles to cover: architect, backend, frontend, DevOps.
- Owner is a **beginner in GenAI/RAG**, and also wants to learn **DevOps + CI/CD** and **Claude Code** while building.
- **Free tiers only** wherever possible (target: $0/month).
- **Timeline: 1 month (~105 hrs).** Availability: 2-3 hrs on weekdays, 6-8 hrs on weekend days. Plan for ~90 productive hours after debugging/free-tier friction.

## 2. The product
**BrainQuest**: a gamified second brain.
Story: *"Notes apps get abandoned. I built one that makes you want to come back."*

Core loop:
1. User captures markdown notes.
2. App chunks + embeds notes (pgvector).
3. LLM generates flashcards/quizzes from notes.
4. User earns XP, levels, streaks (and badges) by capturing and reviewing.
5. User can chat with their notes (RAG) and get answers **with citations**.

## 3. Scope for the 1-month build
**Keep:** auth, notes CRUD, XP/levels/streaks, RAG chat with citations, AI flashcards, spaced repetition (SM-2), badges, boss-battle quiz, hybrid search (keyword+vector), 30-question RAG eval set, Langfuse tracing, Sentry + uptime monitoring, Docker, GitHub Actions CI/CD, live deployment, README/ADRs/demo.

**Defer/cut:** knowledge graph visualization, leaderboard, browser extension, PDF upload, Terraform, Kubernetes, staging environments.

**If time gets tight, drop in this order:** (1) boss-battle mode, (2) badges, (3) Langfuse + Sentry, (4) hybrid search, (5) eval set 30 -> 10 questions.
**Never drop:** live deployment, CI/CD, RAG with citations, README + demo.

## 4. Architecture
```
Browser (Next.js on Vercel)
   -> FastAPI backend (Render / Cloud Run)
        -> Supabase (Postgres + pgvector + Auth)
        -> LLM API (Gemini/Groq) + embeddings model
        (optional later: Upstash Redis for cache/rate-limit/queue)
```
Background work in MVP uses FastAPI `BackgroundTasks` (no queue).
Free-tier caveats: Render sleeps when idle (ping /health with UptimeRobot); Supabase pauses idle projects. Re-check current limits in Week 1.

## 5. Data model (initial)
- `users` (from Supabase auth)
- `notes` (id, user_id, title, content, tags, created_at)
- `chunks` (id, note_id, text, embedding vector)
- `flashcards` (id, note_id, question, answer, ease, interval, due_at)
- `xp_events` (id, user_id, type, points, created_at) — **XP is an event log; levels are computed from it**
- `badges` / `user_badges`
- `quests` / `user_quests` (later)

XP examples: new note +10, card review +5, 7-day streak bonus.

## 6. Four-week plan
**Week 1 — Foundation + deploy.** Sat: repo, board, scaffold Next.js + FastAPI, hello-world deployed on Vercel + Render. Sun: Supabase, auth end to end, Alembic. Weekdays: notes CRUD API + UI (markdown editor), pytest basics, ruff/eslint, pre-commit.
*Milestone: log in on a live URL and create notes.*

**Week 2 — Gamification + CI.** XP event log, level formula, streaks (timezone-aware, unit tested), dashboard (XP bar, streak, level-up animation). Dockerfile (multi-stage) + docker-compose. GitHub Actions CI (lint, type-check, tests, Docker build), branch protection, CD on merge, health check, Dependabot. Watch an intro to embeddings/RAG (~1 hr).
*Milestone: gamified app with real CI/CD.*

**Week 3 — RAG (core learning week).** Embeddings + cosine similarity in a notebook; chunking experiments (~500 tokens, overlap); enable pgvector; chunk+embed on save; similarity search endpoint; prompt building + LLM call; full RAG chat with citations + UI; hybrid search, metadata filters, prompt-injection basics. **Build without LangChain first.**
*Milestone: ask questions about notes, get cited answers.*

**Week 4 — AI gamification, evals, polish.** LLM flashcards (Pydantic-validated JSON), review UI + SM-2, boss-battle + badges, 30-question eval measuring hit-rate before/after hybrid search, Langfuse, Sentry, rate limiting, bug bash, seeded demo account, README + architecture diagram + ADRs + demo GIF/video.
*Milestone: polished, documented, live project.*

## 7. DevOps ladder
1. Free PaaS auto-deploy (Vercel + Render) — Week 1
2. Docker + GitHub Actions CI/CD — Week 2
3. Cloud Run or a free VM with Caddy, environments, migrations in deploy, smoke tests — later/optional
4. Terraform, Grafana dashboards, k6 load tests, local Kubernetes (kind/k3s) — extra credit only

## 8. Resume bullets to aim for
- Built and deployed a gamified RAG-powered knowledge app (Next.js, FastAPI, Postgres/pgvector) at $0/month.
- Improved retrieval hit-rate from X% to Y% via hybrid search, measured on a 30-question eval set.
- Set up CI/CD with GitHub Actions: automated tests, Docker builds, automated deploys.
- Built with an AI-assisted workflow (Claude Code) using CLAUDE.md, tests, and reviewed diffs.

## 9. Claude Code learning ladder
- Week 1: basics, plan-then-edit, permissions, reading code.
- Week 2: CLAUDE.md, slash commands, git workflow.
- Week 3: context management; use Claude as a **tutor**, owner writes the RAG core.
- Week 4: hooks (e.g., ruff on edit), MCP servers, custom commands, subagents.

## 10. Current status
Update this section as milestones are completed.

**Day 1 (2026-09-19/20)**
- [x] Repo skeleton, `.gitignore`, `.env.example` templates
- [x] GitHub Project board ("BrainQuest Roadmap") + issues for Weeks 1-2
- [x] FastAPI scaffold: `/health`, CORS, pytest, ruff (Python 3.12, uv)
- [x] Next.js scaffold: TypeScript strict, Tailwind, shadcn/ui, API health badge
- [x] Deployed: web on Vercel, API on Render (see `docs/DEPLOY.md`); CORS verified from outside
- [x] Live page shows "API status: ok" in a browser (confirmed by owner)
- [x] UptimeRobot monitor on `/health` (keeps the free Render instance awake)

**Day 1 complete.** Milestone toward Week 1: live URL works end to end. Next: Supabase + auth (issue #2), Alembic (issue #3).

**Decisions made along the way**
- Python 3.12 via uv (system Python is 3.14); Render pinned with `PYTHON_VERSION`.
- Commit straight to `main` (no PRs) for now. Week 2's "branch protection" item needs revisiting.