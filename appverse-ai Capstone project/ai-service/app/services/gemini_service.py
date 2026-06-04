import json
import logging
import os
from pathlib import Path
from typing import Optional

import requests

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self) -> None:
        self._load_env_file()
        self.api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
        self.model = (os.getenv("GEMINI_MODEL") or "gemini-1.5-flash").strip()
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set — AI service will use local fallback logic.")
        else:
            logger.info("GeminiService initialised with model=%s", self.model)

    def _load_env_file(self) -> None:
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
            if key and key not in os.environ and value:
                os.environ[key] = value

    def generate_text(self, prompt: str) -> Optional[str]:
        if not self.api_key:
            logger.debug("Skipping Gemini call — no API key configured.")
            return None

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent?key={self.api_key}"
        )
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            },
        }
        try:
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code >= 400:
                logger.error(
                    "Gemini API error %s: %s", response.status_code, response.text[:300]
                )
                return None
            data = response.json()
            candidates = data.get("candidates") or []
            if not candidates:
                logger.warning("Gemini returned no candidates. Full response: %s", data)
                return None
            content = candidates[0].get("content") or {}
            parts = content.get("parts") or []
            if not parts:
                logger.warning("Gemini candidate had no parts.")
                return None
            text = parts[0].get("text")
            return text if isinstance(text, str) and text.strip() else None
        except requests.exceptions.Timeout:
            logger.error("Gemini request timed out.")
            return None
        except Exception as exc:
            logger.error("Gemini request failed: %s", exc, exc_info=True)
            return None

    def generate_json(self, prompt: str):
        text = self.generate_text(prompt)
        if not text:
            return None
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```json", "", 1).replace("```", "").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as exc:
            logger.warning("Gemini returned non-JSON text: %s — parse error: %s", cleaned[:200], exc)
            return None

    def ask(self, prompt: str) -> Optional[str]:
        return self.generate_text(prompt)

    def generate(self, prompt: str) -> Optional[str]:
        return self.generate_text(prompt)

    def analyze(self, prompt: str) -> Optional[str]:
        return self.generate_text(prompt)
