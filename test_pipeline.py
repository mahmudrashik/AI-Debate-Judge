import asyncio
from backend.models.schemas import DebateRequest
from backend.services.pipeline import run_pipeline
request = DebateRequest(
    topic="AI should replace programmers",
    for_argument="AI is much faster and cheaper. It doesn't need sleep and can write bug-free code. Companies can save a lot of money.",
    against_argument="AI lacks human creativity and intuition. It cannot understand complex business requirements properly. Human oversight is always needed.",
    provider="llama33"
)
try:
    res = run_pipeline(request)
    print('SUCCESS')
    print('FOR Score:', res.for_score.score)
    print('AGAINST Score:', res.against_score.score)
except Exception as e:
    print('ERROR:', e)
