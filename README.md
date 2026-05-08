# DebateLens

**DebateLens** is a production-ready **8-agent AI debate analysis system** that evaluates opposing arguments with causal reasoning, fallacy detection, evidence scoring, explainable verdicts, and argument improvement. It is built with FastAPI + LangChain on the backend and React + Vite on the frontend, with Groq and Gemini provider support.

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
- A [Groq API key](https://console.groq.com) and/or a Gemini API key

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
copy .env.example .env       # Windows
# cp .env.example .env       # Linux/Mac
# Edit .env and add GROQ_API_KEY and/or GEMINI_API_KEY

# Start backend (from project root, not inside backend/)
cd ..
uvicorn backend.main:app --reload --port 8005
```

The API will be available at:
- **http://localhost:8005** — API root
- **http://localhost:8005/docs** — Interactive Swagger UI
- **http://localhost:8005/api/health** — Health check

### 2. Frontend Setup

```bash
cd frontend
npm install

# Optional: customize the backend URL for this machine
copy .env.example .env       # Windows
# cp .env.example .env       # Linux/Mac

npm run dev
```

Frontend will be available at **http://localhost:5173**

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Groq API key | — |
| `LLM_MODEL` | Groq model to use | `llama-3.3-70b-versatile` |
| `GEMINI_API_KEY` | Gemini API key for Gemini or comparison mode | — |
| `GEMINI_MODEL` | Primary Gemini model | `gemini-2.5-flash` |
| `GEMINI_MAX_TOKENS` | Gemini output token budget | `8192` |
| `GEMINI_FALLBACK_MODELS` | Ordered Gemini fallback list | `gemini-2.5-flash,gemini-2.5-flash-lite` |
| `GEMINI_THINKING_LEVEL` | Optional Gemini 3 thinking level | `low` |
| `VITE_API_BASE_URL` | Frontend API base URL, set in `frontend/.env` | `http://localhost:8005/api` |

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

- The full pipeline takes **45–90 seconds** depending on provider, prompt size, and API latency
- Agent 8 (improvement) takes an additional **10–20 seconds**
- The backend uses `asyncio.run_in_executor` so the event loop is never blocked
- Gemini uses JSON response mode, a larger output budget, and fallback from `gemini-2.5-flash` to `gemini-2.5-flash-lite`

## 🎓 Sample Debates Included

The web UI includes exactly three sample debates. They are useful for checking different judging outcomes and argument-quality patterns:

### 1. AI in Exams
**Topic:** AI tools should be allowed in university exams in Bangladesh

**Argument FOR:**
> Allowing AI tools in university exams in Bangladesh would significantly enhance the quality of student output and better prepare graduates for the modern workforce. Research from MIT and Stanford shows that students who use AI assistance produce work that is 40% more comprehensive and demonstrates higher-order thinking. In Bangladesh's rapidly digitalizing economy, where technology companies like BJIT, DataSoft, and Pathao are growing rapidly, graduates who are comfortable using AI tools will have a decisive competitive advantage. Furthermore, AI tools level the playing field—students from rural areas with less access to premium coaching centers can now access the same knowledge as their urban counterparts. The purpose of university education is not to test memorization but to evaluate problem-solving ability, analytical thinking, and the capacity to leverage available resources effectively. Banning AI in exams creates an artificial environment that does not reflect real professional settings. Countries like Finland and Singapore already allow AI-assisted examinations with great success, showing measurable improvements in graduate employability.

**Argument AGAINST:**
> Permitting AI tools in university examinations fundamentally undermines the core purpose of academic assessment in Bangladesh. Exams are designed to measure individual understanding, critical thinking, and the depth of knowledge a student has genuinely acquired through study and effort. When AI tools are allowed, it becomes impossible to distinguish between a student's own intellectual capability and the machine's output, rendering grades meaningless. This is particularly dangerous in high-stakes professional fields like medicine, engineering, and law, where practitioners must think independently in emergencies. Bangladesh's educational institutions already face credibility challenges internationally; allowing AI in exams would further devalue Bangladeshi degrees. Moreover, economically disadvantaged students who cannot afford premium AI subscriptions would be systematically disadvantaged. Studies from the University of Dhaka indicate that over 60% of students report reduced motivation to deeply learn material when AI shortcuts are available.

### 2. Plastic Ban
**Topic:** Bangladesh should implement a complete ban on single-use plastics

**Argument FOR:**
> Bangladesh must implement an immediate and comprehensive ban on single-use plastics to protect its rivers, coastal ecosystems, and public health. The Buriganga, Turag, and Shitalakhya rivers are among the most polluted in the world, with plastic waste being a primary contributor. The Bangladesh River Research Institute documented over 200,000 tonnes of plastic entering waterways annually, directly causing fish mortality rates to increase by 35% over the past decade. Single-use plastics also clog drainage systems, directly worsening urban flooding in Dhaka during monsoon season. Bangladesh was the first country in the world to ban thin polythene bags in 2002, demonstrating the political will to act decisively. Jute, Bangladesh's golden fiber, provides an economically superior and already-established alternative for packaging needs.

**Argument AGAINST:**
> A complete ban on single-use plastics in Bangladesh would create severe economic and social disruptions the country is not equipped to handle. Bangladesh's small-scale plastic manufacturing sector employs approximately 2 million workers, predominantly from low-income backgrounds. An abrupt ban without adequate transition and economic safety nets would result in mass unemployment. The practical alternatives—biodegradable packaging, jute, glass—are 3 to 5 times more expensive, inaccessible to most Bangladeshi consumers. Furthermore, the cold chain and food safety infrastructure relies heavily on plastic packaging to prevent contamination. The 2002 polythene bag ban is widely acknowledged to have failed due to poor enforcement, with plastic bags still ubiquitous across markets.

### 3. Against Wins
**Topic:** Dhaka should transition to fully electric public transport within 5 years

**Argument FOR (intentionally weaker):**
> Dhaka should switch all public transport to electric vehicles within five years because electric buses are cleaner and modern. Other cities have started using electric buses, so Dhaka should do the same quickly. Air pollution is a serious problem, and electric transport would help reduce smoke from diesel buses. The city already has some experience with electric trains through the Metrorail, which shows that people are willing to use modern transport. If the government commits to the change, the city can become greener and more advanced. A fast transition would also show that Bangladesh is serious about climate action and technological progress.

**Argument AGAINST (designed to win):**
> A five-year full transition to electric public transport in Dhaka is not realistic because the proposal ignores infrastructure, financing, grid capacity, and workforce disruption. Electric buses require reliable charging depots, upgraded distribution lines, spare-parts supply chains, trained mechanics, and route-level energy planning; Dhaka does not currently have those systems at the scale needed for thousands of vehicles. The upfront cost would also be extremely high: even a 5,000-bus replacement program could require more than $1 billion before accounting for charging infrastructure, land acquisition, battery replacement, and maintenance contracts. Bangladesh's power grid still faces peak-load pressure, so adding large overnight bus-charging demand without phased grid upgrades could shift pollution and reliability problems rather than solve them. A more defensible policy is a phased 10- to 15-year transition that starts with high-ridership corridors, depot pilots, grid upgrades, domestic technician training, and targeted subsidies. That approach captures environmental benefits while reducing fiscal risk, service disruption, and harm to workers in the existing bus and CNG transport ecosystem.

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
│   ├── scripts/
│   │   └── probe_gemini_models.py
│   ├── config.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # InputPage, ResultsPage
│   │   ├── App.jsx
│   │   └── index.css        # Catppuccin Mocha + Airbnb-accent design system
│   ├── package.json
│   ├── .env                 # Custom API URL (optional)
│   └── .env.example         # Template for API URL
├── .env                     # Your API key (not committed)
└── .env.example             # Template
```
