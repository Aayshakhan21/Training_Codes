from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


def _load_env_file() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_env_file()


@dataclass(slots=True)
class Settings:
    app_name: str = field(default="AppVerse AI Service")
    api_prefix: str = field(default="/api/ai")
    gemini_api_key: str = field(default_factory=lambda: os.getenv("GEMINI_API_KEY", ""))
    gemini_model: str = field(default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))  # keep in sync with gemini_service.py fallback
    gemini_base_url: str = field(default_factory=lambda: os.getenv(
        "GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta"
    ))
    request_timeout_seconds: int = field(default_factory=lambda: int(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "30")))
    retry_attempts: int = field(default_factory=lambda: int(os.getenv("AI_RETRY_ATTEMPTS", "2")))
    cors_origins: list[str] = field(default_factory=lambda: [
        origin.strip() for origin in os.getenv(
            "AI_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
        ).split(",")
        if origin.strip()
    ])

    @property
    def generate_content_url(self) -> str:
        return f"{self.gemini_base_url.rstrip('/')}/models/{self.gemini_model}:generateContent"


settings = Settings()
