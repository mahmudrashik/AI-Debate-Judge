import { useState } from 'react'

const PRIORITY_STYLE = {
  high:   { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  icon: '🔴', label: 'High Priority'   },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '🟡', label: 'Medium Priority' },
  low:    { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '🟢', label: 'Low Priority'    },
}

function ImprovementCard({ imp, index }) {
  const [expanded, setExpanded] = useState(false)
  const p      = PRIORITY_STYLE[imp.priority] || PRIORITY_STYLE.medium
  const isLong = imp.suggestion.length > 120

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 'var(--radius)',
      background: p.bg, border: `1px solid ${p.border}`,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: 9, fontWeight: 800, color: p.color,
              background: `${p.color}18`, padding: '3px 8px',
              borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              {p.label}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>#{index + 1}</span>
          </div>
          <p style={{
            fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65,
            display: (!expanded && isLong) ? '-webkit-box' : 'block',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
            overflow: (!expanded && isLong) ? 'hidden' : 'visible',
          }}>
            {imp.suggestion}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} style={{
              all: 'unset', cursor: 'pointer', fontSize: 11, color: p.color,
              marginTop: 6, fontWeight: 600,
            }}>
              {expanded ? '▲ Show less' : '▼ Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ImprovementPanel({ improvements }) {
  const forItems     = improvements.filter(i => i.side === 'FOR')
  const againstItems = improvements.filter(i => i.side === 'AGAINST')

  const renderList = (items, side, color) => (
    <div className="card fade-in-up" style={{ borderColor: `${color}20` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color, fontWeight: 800, fontSize: 15 }}>
          {side === 'FOR' ? '✅ FOR' : '❌ AGAINST'} Improvements
        </h3>
        {items.length > 0 && (
          <span className="badge" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
            {items.length} suggestion{items.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ fontSize: 36, marginBottom: 10 }}>✨</p>
          <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>Argument is already strong!</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>No specific improvements suggested.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((imp, i) => <ImprovementCard key={i} imp={imp} index={i} />)}
        </div>
      )}
    </div>
  )

  if (improvements.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>🏆</p>
        <p style={{ color: 'var(--success)', fontWeight: 700, fontSize: 16 }}>Both arguments are strong!</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>No improvements suggested by the AI judge.</p>
      </div>
    )
  }

  return (
    /* Use inline grid style instead of class — class requires viewport-aware CSS */
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 24,
    }}>
      {renderList(forItems,     'FOR',     'var(--success)')}
      {renderList(againstItems, 'AGAINST', 'var(--danger)')}
    </div>
  )
}
