import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ProblemCard from '../components/ProblemCard'
import PostProblemModal from '../components/PostProblemModal'
import './HomePage.css'

export default function HomePage() {
  const { problems, user, totalFunds, totalProblems } = useApp()
  const [showPostModal, setShowPostModal] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

  const completedCount = problems.filter(
    (p) => p.displayStatus === 'Completed' || p.status === 'COMPLETED'
  ).length
  const totalJoined = problems.reduce((s, p) => s + (p.joinedCount || 0), 0)

  const handlePosted = (problem) => {
    setSuccessToast(problem.title)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-split">
          {/* Left: copy */}
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Live Community Problems
            </div>
            <h1 className="hero-title">
              Fix Real Problems.<br />
              <span className="hero-title-accent">Build Real Trust.</span>
            </h1>
            <p className="hero-sub">
              FixLedger connects communities with volunteers. Post a problem,
              fund it transparently, upload proof — and watch funds release
              automatically when work is verified.
            </p>
            <div className="hero-trust-pills">
              <div className="trust-pill">
                <span className="trust-pill-icon">🔗</span>
                No Middlemen
              </div>
              <div className="trust-pill">
                <span className="trust-pill-icon">👁️</span>
                Full Transparency
              </div>
              <div className="trust-pill">
                <span className="trust-pill-icon">🛡️</span>
                Proof-First Funds
              </div>
              <div className="trust-pill">
                <span className="trust-pill-icon">📊</span>
                Live Ledger
              </div>
            </div>
            <div className="hero-cta-row">
              <button
                className="btn btn-primary btn-lg hero-post-btn"
                onClick={() => setShowPostModal(true)}
                id="hero-btn-post-problem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post a Problem
              </button>
              <span className="hero-cta-hint">Free · No signup needed</span>
            </div>
          </div>

          {/* Right: live stats panel */}
          <div className="hero-stats-panel">
            <div className="hsp-header">
              <span className="hsp-dot" />
              <span className="hsp-label">Live Trust Dashboard</span>
            </div>
            <div className="hsp-grid">
              <div className="hsp-card hsp-card-accent">
                <span className="hsp-card-value">Rs. {totalFunds.toLocaleString()}</span>
                <span className="hsp-card-label">Total Funds in Escrow</span>
              </div>
              <div className="hsp-card">
                <span className="hsp-card-value">{totalProblems}</span>
                <span className="hsp-card-label">Problems Posted</span>
              </div>
              <div className="hsp-card hsp-card-green">
                <span className="hsp-card-value">{completedCount}</span>
                <span className="hsp-card-label">Completed ✓</span>
              </div>
              <div className="hsp-card">
                <span className="hsp-card-value">{totalJoined}</span>
                <span className="hsp-card-label">People Joined</span>
              </div>
            </div>
            <div className="hsp-trust-loop">
              <p className="hsp-tl-label">Trust Flow</p>
              <div className="hsp-tl-steps">
                {['📍 Post', '💰 Fund', '🙋 Act', '📸 Prove', '✅ Pay'].map((s, i, a) => (
                  <span key={i} className="hsp-tl-item">
                    <span className="hsp-tl-step">{s}</span>
                    {i < a.length - 1 && <span className="hsp-tl-arrow">→</span>}
                  </span>
                ))}
              </div>
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
            <div className="section-header-right">
              <div className="problems-count-badge">
                <span>{problems.length} Problems</span>
              </div>
              <button
                className="btn btn-primary post-problem-btn"
                onClick={() => setShowPostModal(true)}
                id="btn-post-problem"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post Problem
              </button>
            </div>
          </div>

          <div className="problems-grid">
            {problems.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${Math.min(i, 5) * 0.08}s` }}>
                <ProblemCard problem={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="trust-loop-section">
        <div className="container">
          <div className="trust-loop-card">
            <p className="trust-loop-label">How FixLedger Works</p>
            <div className="trust-loop-steps">
              {[
                { icon: '📍', label: 'Problem Posted' },
                { icon: '💰', label: 'Fund Set' },
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

      {/* Post Problem Modal */}
      {showPostModal && (
        <PostProblemModal
          onClose={() => setShowPostModal(false)}
          onPosted={handlePosted}
        />
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="post-success-toast animate-fade-up">
          <span className="toast-icon">✅</span>
          <div>
            <strong>Problem Posted on FixLedger!</strong>
            <p className="toast-sub">"{successToast.slice(0, 50)}{successToast.length > 50 ? '...' : ''}" is now live</p>
          </div>
        </div>
      )}
    </div>
  )
}
