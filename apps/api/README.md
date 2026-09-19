# BrainQuest API

FastAPI backend. Python 3.12, managed with [uv](https://docs.astral.sh/uv/).

```bash
cd apps/api
cp .env.example .env            # first time only
uv sync                         # install dependencies
uv run uvicorn main:app --reload   # dev server on http://localhost:8000
uv run pytest                   # tests
uv run ruff check .             # lint
```
