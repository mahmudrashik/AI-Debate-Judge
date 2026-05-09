"""Backend configuration — loads from .env and provides a shared LLM factory."""
import os
from dotenv import load_dotenv

_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=_env_path, override=True)

# Module-level constants (read once at import for startup validation)
GROQ_API_KEY: str    = os.getenv("GROQ_API_KEY", "")
LLM_MODEL: str       = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
SECONDARY_MODEL: str = os.getenv("SECONDARY_MODEL", "llama-3.3-70b-versatile")

# NOTE: We do NOT raise here — main.py lifespan event validates the key at
# startup and gives a clear error message. Raising at import time would make
# every unit-test import crash with no helpful message.


def get_llm(temperature: float = 0.1, provider: str = "groq"):
    """Return a configured LLM instance.

    provider='groq'    → Primary model:   llama-3.1-8b-instant       (GROQ_API_KEY)
    provider='llama33' → Secondary model: llama-3.3-70b-versatile    (GROQ_API_KEY_SECONDARY)

    Keys are re-read from the environment on EVERY call so that the .env values
    are always up-to-date regardless of import order.
    Raises a clear RuntimeError if GROQ_API_KEY is missing.
    """
    # Always re-read from the live environment — never use stale module-level cache
    _env_path_rt = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    load_dotenv(dotenv_path=_env_path_rt, override=True)

    primary_key   = os.getenv("GROQ_API_KEY", "")
    secondary_key = os.getenv("GROQ_API_KEY_SECONDARY", "")

    if not primary_key:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Please add it to your .env file and restart."
        )

    # If no secondary key configured, fall back to primary key
    if not secondary_key:
        secondary_key = primary_key
        print(f"[Config] WARNING: GROQ_API_KEY_SECONDARY not set — falling back to primary key for secondary provider!")

    try:
        from langchain_groq import ChatGroq  # imported lazily so tests can mock

        provider_norm = provider.lower().strip()
        if provider_norm in ("llama33", "gemma2"):
            model_name = os.getenv("SECONDARY_MODEL", "llama-3.3-70b-versatile")
            key_to_use = secondary_key
            print(f"[Config] SECONDARY → model={model_name} | key={secondary_key[:8]}... | provider_arg='{provider}'")
        else:
            model_name = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
            key_to_use = primary_key
            print(f"[Config] PRIMARY   → model={model_name} | key={primary_key[:8]}... | provider_arg='{provider}'")

        return ChatGroq(
            model=model_name,
            api_key=key_to_use,
            temperature=temperature,
            max_retries=2,  # built-in retry for transient errors
        )
    except ImportError as exc:
        raise RuntimeError(
            "langchain_groq is not installed. Run: pip install langchain-groq"
        ) from exc
