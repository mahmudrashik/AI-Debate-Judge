# Causal XAI Debate Judge

A production-ready **8-agent AI system** that analyzes debate arguments using causal reasoning and explainable AI techniques. Built with FastAPI + LangChain + Groq (LLaMA 3.1 & LLaMA 3.3) on the backend and React + Vite on the frontend.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 8-AGENT LangChain PIPELINE               │
│                                                         │
│  Agent 1: Topic Context   → Classifies domain & entities │
│  Agent 2: Arg Extraction  → Parses claim/reasons/evidence│
│  Agent 3: Causal Reasoning→ Maps cause-effect chains     │
│  Agent 4: Fallacy Detect  → Identifies logical fallacies │
│  Agent 5: Evidence Quality→ Scores evidence dimensions   │
│  Agent 6: Scoring         → 100-point debate scoring     │
│  Agent 7: Explanation     → Winner + counterfactual      │
│  Agent 8: Improvement     → AI rewrites weak arguments   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### 1. Backend Setup

```bash
# From project root
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment
# Create a .env file and add your GROQ_API_KEY
# .env should contain:
# GROQ_API_KEY=your_key_here
# LLM_MODEL=llama-3.1-8b-instant
# SECONDARY_MODEL=llama-3.3-70b-versatile

# Start backend (from project root, not inside backend/)
cd ..
uvicorn backend.main:app --reload --port 8000
```

The API will be available at:
- **http://localhost:8000** — API root
- **http://localhost:8000/docs** — Interactive Swagger UI
- **http://localhost:8000/api/health** — Health check

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:5173**

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key (required) | — |
| `LLM_MODEL` | Primary Groq model | `llama-3.1-8b-instant` |
| `SECONDARY_MODEL` | Secondary Groq model for comparison | `llama-3.3-70b-versatile` |

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/analyze-debate` | Run full 8-agent pipeline |
| `GET` | `/api/results/{id}` | Get analysis result by ID |
| `GET` | `/api/history` | List session results |
| `POST` | `/api/improve-argument` | Agent 8: rewrite argument |
| `GET` | `/api/causal-graph/{id}/for` | FOR side causal graph |
| `GET` | `/api/causal-graph/{id}/against` | AGAINST side causal graph |
| `GET` | `/api/health` | Health check |

## ⏱️ Performance Notes

- The full pipeline takes **45–90 seconds** (7 sequential LLM calls to Groq)
- Agent 8 (improvement) takes an additional **10–20 seconds**
- The backend uses `asyncio.run_in_executor` so the event loop is never blocked

## 🎓 Sample Debates Included

1. **AI in Exams** — Should AI tools be allowed in Bangladeshi university exams?
2. **Plastic Ban** — Should Bangladesh ban single-use plastics?
3. **Electric Transit** — Should Dhaka transition to electric public transport?

## 📁 Project Structure

```
Project/
├── backend/
│   ├── agents/              # 8 LangChain agents
│   │   ├── topic_agent.py
│   │   ├── extraction_agent.py
│   │   ├── causal_agent.py
│   │   ├── fallacy_agent.py
│   │   ├── evidence_agent.py
│   │   ├── scoring_agent.py
│   │   ├── explanation_agent.py
│   │   └── improvement_agent.py
│   ├── models/schemas.py    # Pydantic models
│   ├── routes/debate.py     # FastAPI routes
│   ├── services/
│   │   ├── pipeline.py      # Pipeline orchestrator
│   │   └── result_store.py  # In-memory session store
│   ├── config.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # InputPage, ResultsPage
│   │   ├── App.jsx
│   │   └── index.css        # Design system
│   └── package.json
├── .env                     # Your API key (not committed)
└── README.md
```
