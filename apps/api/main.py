from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings

app = FastAPI(title="BrainQuest API")

# Browsers block cross-origin requests unless the server opts in.
# Only the frontend's origin is allowed to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Liveness check used by the frontend, uptime monitor and deploy platform."""
    return HealthResponse(status="ok")
