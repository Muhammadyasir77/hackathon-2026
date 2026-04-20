import { problems } from '../data/problems'
import ProblemCard from '../components/ProblemCard'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Live Community Problems
          </div>
          <h1 className="hero-title">
            Real Problems.<br />
            <span className="hero-title-accent">Real Trust.</span><br />
            Real Impact.
          </h1>
          <p className="hero-sub">
            CivicTrust connects communities around shared problems. Join a cause, take action,
            upload proof — and watch funds release transparently when work is verified.
          </p>
          <div className="hero-trust-pills">
            <div className="trust-pill">
              <span className="trust-pill-icon">🔗</span>
              No Isolation
            </div>
            <div className="trust-pill">
              <span className="trust-pill-icon">👁️</span>
              Full Transparency
            </div>
            <div className="trust-pill">
              <span className="trust-pill-icon">🛡️</span>
              Proof-First Funds
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="problems-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-heading">Active Community Problems</h2>
              <p className="section-sub">Click any problem to see the full trust flow in action</p>
            </div>
            <div className="problems-count-badge">
              <span>{problems.length} Problems</span>
            </div>
          </div>

          <div className="problems-grid">
            {problems.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <ProblemCard problem={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Loop Banner */}
      <section className="trust-loop-section">
        <div className="container">
          <div className="trust-loop-card">
            <p className="trust-loop-label">How It Works</p>
            <div className="trust-loop-steps">
              {[
                { icon: '📍', label: 'Problem Posted' },
                { icon: '👥', label: 'People Join' },
                { icon: '🙋', label: 'Task Taken' },
                { icon: '📸', label: 'Proof Uploaded' },
                { icon: '🤖', label: 'AI Verifies' },
                { icon: '💸', label: 'Funds Released' },
                { icon: '📊', label: 'Ledger Updated' },
              ].map((step, i, arr) => (
                <div key={i} className="tl-item">
                  <div className="tl-step">
                    <span className="tl-icon">{step.icon}</span>
                    <span className="tl-label">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="tl-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
