# BrainQuest Web

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.

```bash
cd apps/web
cp .env.example .env.local   # first time only
npm install
npm run dev                  # http://localhost:3000 (needs the API running for the health badge)
npm run lint
npm run build
```

`NEXT_PUBLIC_*` variables are inlined at **build time**, so set them in Vercel before deploying.
