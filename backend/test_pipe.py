import sys
import traceback
sys.path.append('c:/Users/mahmu/OneDrive/Documents/Semester 8/AI Lab/Project')
from backend.models.schemas import DebateRequest
from backend.services.pipeline import run_pipeline

req = DebateRequest(topic='AI', for_argument='AI is good', against_argument='AI is bad', provider='gemini')
try:
    res = run_pipeline(req)
    print("FOR SCORE:", res.for_score.score)
    print("AGAINST SCORE:", res.against_score.score)
except Exception as e:
    traceback.print_exc()
