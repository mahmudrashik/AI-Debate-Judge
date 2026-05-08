"""Backend configuration — loads from .env and provides a shared LLM factory."""
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path, override=True)
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
LLM_MODEL: str    = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

# NOTE: We do NOT raise here — main.py lifespan event validates the key at
# startup and gives a clear error message. Raising at import time would make
# every unit-test import crash with no helpful message.


def get_llm(temperature: float = 0.1, provider: str = "groq"):
    """Return a configured LLM instance based on the provider.
    Raises a clear RuntimeError if the required API key is missing.
    """
    if provider.lower() == "gemini":
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Please add it to your .env file."
            )
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                model=GEMINI_MODEL,
                google_api_key=GEMINI_API_KEY,
                temperature=temperature,
            )
        except ImportError as exc:
            raise RuntimeError(
                "langchain-google-genai is not installed. Run: pip install langchain-google-genai"
            ) from exc

    # Default to Groq
    if not GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Please add it to your .env file and restart."
        )
    try:
        from langchain_groq import ChatGroq  # imported lazily so tests can mock
        return ChatGroq(
            model=LLM_MODEL,
            api_key=GROQ_API_KEY,
            temperature=temperature,
        )
    except ImportError as exc:
        raise RuntimeError(
            "langchain_groq is not installed. Run: pip install langchain-groq"
        ) from exc
