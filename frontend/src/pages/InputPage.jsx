import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useToast } from '../components/ToastProvider'

const API = 'http://localhost:8000/api'

const SAMPLE_DEBATES = [
  {
    icon: '🎓',
    label: 'AI in Exams',
    topic: 'AI tools should be allowed in university exams in Bangladesh',
    for_argument: `Allowing AI tools in university exams in Bangladesh would significantly enhance the quality of student output and better prepare graduates for the modern workforce. Research from MIT and Stanford shows that students who use AI assistance produce work that is 40% more comprehensive and demonstrates higher-order thinking. In Bangladesh's rapidly digitalizing economy, where technology companies like BJIT, DataSoft, and Pathao are growing rapidly, graduates who are comfortable using AI tools will have a decisive competitive advantage. Furthermore, AI tools level the playing field—students from rural areas with less access to premium coaching centers can now access the same knowledge as their urban counterparts. The purpose of university education is not to test memorization but to evaluate problem-solving ability, analytical thinking, and the capacity to leverage available resources effectively. Banning AI in exams creates an artificial environment that does not reflect real professional settings. Countries like Finland and Singapore already allow AI-assisted examinations with great success, showing measurable improvements in graduate employability.`,
    against_argument: `Permitting AI tools in university examinations fundamentally undermines the core purpose of academic assessment in Bangladesh. Exams are designed to measure individual understanding, critical thinking, and the depth of knowledge a student has genuinely acquired through study and effort. When AI tools are allowed, it becomes impossible to distinguish between a student's own intellectual capability and the machine's output, rendering grades meaningless. This is particularly dangerous in high-stakes professional fields like medicine, engineering, and law, where practitioners must think independently in emergencies. Bangladesh's educational institutions already face credibility challenges internationally; allowing AI in exams would further devalue Bangladeshi degrees. Moreover, economically disadvantaged students who cannot afford premium AI subscriptions would be systematically disadvantaged. Studies from the University of Dhaka indicate that over 60% of students report reduced motivation to deeply learn material when AI shortcuts are available.`,
  },
  {
    icon: '♻️',
    label: 'Plastic Ban',
    topic: 'Bangladesh should implement a complete ban on single-use plastics',
    for_argument: `Bangladesh must implement an immediate and comprehensive ban on single-use plastics to protect its rivers, coastal ecosystems, and public health. The Buriganga, Turag, and Shitalakhya rivers are among the most polluted in the world, with plastic waste being a primary contributor. The Bangladesh River Research Institute documented over 200,000 tonnes of plastic entering waterways annually, directly causing fish mortality rates to increase by 35% over the past decade. Single-use plastics also clog drainage systems, directly worsening urban flooding in Dhaka during monsoon season. Bangladesh was the first country in the world to ban thin polythene bags in 2002, demonstrating the political will to act decisively. Jute, Bangladesh's golden fiber, provides an economically superior and already-established alternative for packaging needs.`,
    against_argument: `A complete ban on single-use plastics in Bangladesh would create severe economic and social disruptions the country is not equipped to handle. Bangladesh's small-scale plastic manufacturing sector employs approximately 2 million workers, predominantly from low-income backgrounds. An abrupt ban without adequate transition and economic safety nets would result in mass unemployment. The practical alternatives—biodegradable packaging, jute, glass—are 3 to 5 times more expensive, inaccessible to most Bangladeshi consumers. Furthermore, the cold chain and food safety infrastructure relies heavily on plastic packaging to prevent contamination. The 2002 polythene bag ban is widely acknowledged to have failed due to poor enforcement, with plastic bags still ubiquitous across markets.`,
  },
  {
    icon: '⚡',
    label: 'Electric Transit',
    topic: 'Dhaka should transition to electric public transport within 10 years',
    for_argument: `Dhaka's transition to a fully electric public transport system within a decade is urgently necessary. Dhaka consistently ranks among the world's most polluted cities; the WHO estimates air pollution causes over 80,000 premature deaths annually in Bangladesh, with transport emissions accounting for 30% of Dhaka's particulate matter. Electric buses and trains produce zero direct emissions. The economic case is compelling: electric vehicles have 60-80% lower operating costs than diesel alternatives. Dhaka's existing Metrorail project has already demonstrated that Bangladeshi commuters readily adopt modern electric transit. Crucially, China successfully transitioned Shenzhen's entire 16,000-bus fleet to electric in just 5 years, proving the timeline is achievable.`,
    against_argument: `The proposal to transition Dhaka's entire public transport to electric within 10 years drastically underestimates the infrastructural complexities involved. Electric vehicles require a robust electricity grid—something Dhaka has historically struggled with, experiencing frequent load-shedding that would render electric buses inoperable during critical commuting hours. The upfront capital cost is enormous; replacing even 5,000 buses at $200,000-$300,000 each would require $1-1.5 billion. Bangladesh's government already faces significant fiscal constraints. The transition would also severely displace hundreds of thousands of workers in the existing CNG, rickshaw, and bus ecosystem with no social safety net available.`,
  },
]

const PIPELINE_STEPS = [
  { icon: '🌐', label: 'Topic Context Agent',     desc: 'Classifying domain & entities' },
  { icon: '🔍', label: 'Argument Extraction',     desc: 'Parsing claims, reasons & evidence' },
  { icon: '🔗', label: 'Causal Reasoning Agent',  desc: 'Mapping cause-effect chains' },
  { icon: '⚠️', label: 'Fallacy Detection',       desc: 'Identifying logical weaknesses' },
  { icon: '📊', label: 'Evidence Quality Agent',  desc: 'Scoring specificity & credibility' },
  { icon: '🏆', label: 'Scoring Agent',            desc: 'Evaluating 6 debate dimensions' },
  { icon: '💡', label: 'Explanation & Improvement',desc: 'Generating insights & winner' },
  { icon: '✨', label: 'Argument Improvement',    desc: 'AI rewriting weak arguments (on demand)' },
]

export default function InputPage({ onSubmit, onHistoryOpen }) {
  const [topic,      setTopic]    = useState('')
  const [forArg,     setForArg]   = useState('')
  const [againstArg, setAgainst]  = useState('')
  const [loading,    setLoading]  = useState(false)
  const [error,      setError]    = useState('')
  const [step,       setStep]     = useState(-1)
  const [pct,        setPct]      = useState(0)
  const [backendOk,  setBackendOk]= useState(true)
  const [provider,   setProvider] = useState('both')

  const addToast = useToast();

  // Check backend health on mount
  useEffect(() => {
    axios.get(`${API}/health`, { timeout: 4000 })
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false))
  }, [])

  // Animate progress during loading
  useEffect(() => {
    if (!loading) { setStep(-1); setPct(0); return }
    let i = 0
    // We have 7 active agents (Agent 8 is on-demand), so animate steps 0-6
    // Groq is incredibly fast, so we use 1200ms instead of 7000ms
    const STEP_MS = 1200
    const tick = setInterval(() => {
      i++
      if (i < 7) {
        setStep(i - 1)
        setPct(Math.round((i / 7) * 95))
      }
    }, STEP_MS)
    return () => clearInterval(tick)
  }, [loading])

  const loadSample = useCallback((s) => {
    setTopic(s.topic)
    setForArg(s.for_argument)
    setAgainst(s.against_argument)
    setError('')
  }, [])

  const wordCount = (t) => t.split(/\s+/).filter(Boolean).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim() || !forArg.trim() || !againstArg.trim()) {
      setError('Please fill in all three fields before analysing.')
      return
    }
    if (wordCount(forArg) < 30 || wordCount(againstArg) < 30) {
      setError('Each argument should be at least 30 words for meaningful analysis.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (provider === 'both') {
        const p1 = axios.post(`${API}/analyze-debate`, { topic, for_argument: forArg, against_argument: againstArg, provider: 'groq' })
        const p2 = axios.post(`${API}/analyze-debate`, { topic, for_argument: forArg, against_argument: againstArg, provider: 'llama33' })
        const [res1, res2] = await Promise.all([p1, p2])
        setPct(98)
        const [full1, full2] = await Promise.all([
          axios.get(`${API}/results/${res1.data.id}`),
          axios.get(`${API}/results/${res2.data.id}`)
        ])
        
        // Fast-forward animation to visually complete remaining steps if API was faster than animation
        for (let s = 1; s <= 7; s++) {
          setStep(prev => Math.max(prev, s - 1))
          setPct(Math.round((s / 7) * 98))
          await new Promise(r => setTimeout(r, 120))
        }
        
        setPct(100)
        await new Promise(r => setTimeout(r, 400))
        if (addToast && (res1.data.cached || res2.data.cached)) addToast('⚡ Retrieved instantly from cache!', 'success');
        onSubmit([full1.data, full2.data])
      } else {
        const res = await axios.post(`${API}/analyze-debate`, {
          topic, for_argument: forArg, against_argument: againstArg, provider
        })
        const { id, cached } = res.data
        if (cached && addToast) addToast('⚡ Retrieved instantly from cache!', 'success');
        
        setPct(98)
        const full = await axios.get(`${API}/results/${id}`)
        
        // Fast-forward animation to visually complete remaining steps
        for (let s = 1; s <= 7; s++) {
          setStep(prev => Math.max(prev, s - 1))
          setPct(Math.round((s / 7) * 98))
          await new Promise(r => setTimeout(r, 120))
        }
        
        setPct(100)
        await new Promise(r => setTimeout(r, 400))
        onSubmit([full.data])
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Something went wrong. Is the backend running?'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────── */}
      <header style={{
        padding: '16px 40px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,10,18,0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent), #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 4px 16px rgba(108,99,255,0.5)',
        }}>⚖️</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' }}>Causal XAI Debate Judge</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>8-Agent Pipeline · Groq LLaMA 3.1 & LLaMA 3.3 · Explainable AI</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-accent">8 Agents</span>
          <span className="badge badge-success">Groq Free</span>
          {/* Backend status indicator */}
          <span
            className="badge"
            style={{
              background: backendOk ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: backendOk ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${backendOk ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}
          >
            {backendOk ? '🟢 Backend Online' : '🔴 Backend Offline'}
          </span>
          <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }}
            onClick={onHistoryOpen}>
            🕐 History
          </button>
        </div>
      </header>

      {/* ── Backend offline warning ───────────────── */}
      {!backendOk && (
        <div style={{
          padding: '14px 40px',
          background: 'rgba(239,68,68,0.08)',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>Backend server is not reachable</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Start the backend with:{' '}
              <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
                uvicorn backend.main:app --reload
              </code>
            </p>
          </div>
        </div>
      )}

      {/* ── Hero ────────────────────────────────────── */}
      <div className="hero-section" style={{
        textAlign: 'center', padding: '72px 24px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="badge badge-cyan" style={{ marginBottom: 18, fontSize: 10 }}>
          🇧🇩 Bangladesh Social Issues · English &amp; Bangla
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: 20,
          letterSpacing: '-0.03em',
        }}>
          <span className="gradient-text">AI-Powered</span>
          <br />Debate Judge
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Submit two opposing arguments and our <strong style={{ color: 'var(--accent-light)' }}>8-agent AI pipeline</strong> will
          analyze causal chains, detect fallacies, score both sides, and declare a winner with
          full explainability.
        </p>

        {/* Agent pill strip */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
          {['🌐 Topic', '🔍 Extract', '🔗 Causal', '⚠️ Fallacy', '📊 Evidence', '🏆 Score', '💡 Explain', '✨ Improve'].map(a => (
            <span key={a} className="badge badge-accent" style={{ fontSize: 10, padding: '5px 10px' }}>{a}</span>
          ))}
        </div>
      </div>

      {/* ── Sample Debates ───────────────────────────── */}
      <div className="page-padding" style={{ padding: '0 40px 28px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>
          📌 LOAD A SAMPLE DEBATE
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {SAMPLE_DEBATES.map((s, i) => (
            <button key={i} className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 16px' }}
              onClick={() => loadSample(s)} disabled={loading}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Form ───────────────────────────────── */}
      <div style={{ flex: 1, padding: '0 40px 80px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleSubmit}>

          {/* Topic field */}
          <div className="card" style={{ marginBottom: 20, background: 'rgba(108,99,255,0.04)', borderColor: 'var(--border-accent)' }}>
            <label>🎯 Debate Topic / Motion</label>
            <input type="text" id="topic-input" value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. AI tools should be allowed in university exams in Bangladesh"
              disabled={loading} />
          </div>


          {/* Provider Selection */}
          <div className="card" style={{ marginBottom: 20, background: 'rgba(108,99,255,0.04)', borderColor: 'var(--border-accent)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ margin: 0, whiteSpace: 'nowrap', fontWeight: 700 }}>🧠 AI Model:</label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              disabled={loading}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-accent)', color: '#fff', fontSize: 14, minWidth: 200 }}
            >
              <option value="groq" style={{background: '#1a1b26'}}>🦙 Groq — LLaMA 3.1 (8B)</option>
              <option value="llama33" style={{background: '#1a1b26'}}>💎 Groq — LLaMA 3.3 (70B)</option>
              <option value="both" style={{background: '#1a1b26'}}>⚖️ Compare Both (Side-by-Side)</option>
            </select>
          </div>

          {/* Arguments grid */}

          <div className="grid-2col page-padding" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* FOR */}
            <div className="card" style={{ borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ margin: 0 }}>
                  <span style={{ color: 'var(--success)', marginRight: 6 }}>✅ FOR</span>
                  — Supporting Argument
                </label>
                <span style={{ fontSize: 11, color: wordCount(forArg) < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {wordCount(forArg)} words {wordCount(forArg) < 30 && wordCount(forArg) > 0 ? '(min 30)' : ''}
                </span>
              </div>
              <textarea id="for-arg" value={forArg}
                onChange={e => setForArg(e.target.value)}
                placeholder="Enter the argument in favour of the motion..."
                disabled={loading} style={{ minHeight: 240, borderColor: 'rgba(16,185,129,0.2)' }} />
            </div>

            {/* AGAINST */}
            <div className="card" style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ margin: 0 }}>
                  <span style={{ color: 'var(--danger)', marginRight: 6 }}>❌ AGAINST</span>
                  — Opposing Argument
                </label>
                <span style={{ fontSize: 11, color: wordCount(againstArg) < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {wordCount(againstArg)} words {wordCount(againstArg) < 30 && wordCount(againstArg) > 0 ? '(min 30)' : ''}
                </span>
              </div>
              <textarea id="against-arg" value={againstArg}
                onChange={e => setAgainst(e.target.value)}
                placeholder="Enter the argument against the motion..."
                disabled={loading} style={{ minHeight: 240, borderColor: 'rgba(239,68,68,0.2)' }} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '14px 18px', borderRadius: 'var(--radius)',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              color: 'var(--danger)', marginBottom: 20, fontSize: 14,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="card" style={{
              background: 'rgba(108,99,255,0.06)',
              borderColor: 'var(--border-accent)',
              padding: '32px 40px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div className="spinner" />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Running 8-Agent Pipeline</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                    Groq is extremely fast — 7 agents complete in ~8–12 seconds
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-light)', lineHeight: 1 }}>{pct}%</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar" style={{ marginBottom: 24, height: 8 }}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>

              {/* Agent checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {PIPELINE_STEPS.slice(0, 7).map((s, i) => {
                  const done   = i < step
                  const active = i === step
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10,
                      background: done ? 'rgba(16,185,129,0.08)' : active ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : active ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
                      transition: 'all 0.4s ease',
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>
                        {done ? '✅' : active ? <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: 14 }}>⚙️</span> : '⬜'}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: done ? 'var(--success)' : active ? 'var(--accent-light)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.icon} {s.label}
                        </p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.desc}</p>
                      </div>
                    </div>
                  )
                })}
                {/* Agent 8 — always "on demand", shown greyed out */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed var(--border)',
                  opacity: 0.5,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>✨ Argument Improvement</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>On-demand after results</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                id="analyze-btn"
                type="submit"
                className="btn btn-primary"
                style={{ padding: '16px 56px', fontSize: 16, borderRadius: 14 }}
                disabled={!backendOk}
              >
                ⚡ Analyze Debate
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
