import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StateMachineBar from '../components/StateMachineBar'
import './DetailPage.css'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { problems } = useApp()
  const problem = problems.find((p) => String(p.id) === String(id))

  // ── State Machine ──
  const [taskStatus, setTaskStatus] = useState(
    problem?.displayStatus === 'Completed' ? 'COMPLETED' : 'OPEN'
  )
  const [joinedCount, setJoinedCount] = useState(problem?.joinedCount ?? 0)
  const [hasJoined, setHasJoined] = useState(false)
  const [joinBumping, setJoinBumping] = useState(false)
  const [afterImage, setAfterImage] = useState(null)
  const [progress, setProgress] = useState(
    problem?.displayStatus === 'Completed' ? 100 : 0
  )
  const [verifyMsg, setVerifyMsg] = useState('')
  const [ledgerPaid, setLedgerPaid] = useState(
    problem?.displayStatus === 'Completed'
  )
  const [activeTab, setActiveTab] = useState('overview')
  const fileInputRef = useRef()

  if (!problem) {
    return (
      <div className="not-found container">
        <h2>Problem not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Go Home</button>
      </div>
    )
  }

  // ── Handlers ──
  const handleJoin = () => {
    if (hasJoined) return
    setHasJoined(true)
    setJoinedCount((c) => c + 1)
    setJoinBumping(true)
    setTimeout(() => setJoinBumping(false), 500)
  }

  const handleTakeTask = () => {
    if (taskStatus !== 'OPEN') return
    setTaskStatus('LOCKED')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAfterImage(url)
    setTaskStatus('VERIFYING')
    setVerifyMsg('AI VERIFYING PROOF...')

    setTimeout(() => {
      setTaskStatus('COMPLETED')
      setProgress(100)
      setVerifyMsg('Verified Successfully')
      setLedgerPaid(true)
    }, 3000)
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: problem.title, url })
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
    }
  }

  const displayAfterImage = afterImage || (taskStatus === 'COMPLETED' ? problem.afterImagePlaceholder : null)

  // ── Status helpers ──
  const statusConfig = {
    OPEN: { label: 'Open', cls: 'badge-open' },
    LOCKED: { label: 'Locked', cls: 'badge-locked' },
    VERIFYING: { label: 'Verifying', cls: 'badge-verifying' },
    COMPLETED: { label: 'Completed', cls: 'badge-completed' },
  }
  const sc = statusConfig[taskStatus]

  const starRating = (r) => {
    const full = Math.floor(r)
    const half = r % 1 >= 0.5
    return (
      <span className="star-rating">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
        <em>{r}</em>
      </span>
    )
  }

  return (
    <div className="detail-page">
      <div className="container">

        {/* Back + Title row */}
        <div className="detail-topbar">
          <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <div className="detail-title-row">
            <h1 className="detail-main-title">{problem.title}</h1>
            <button className="btn btn-ghost btn-sm share-btn-detail" onClick={handleShare} aria-label="Share this problem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>
          </div>
          <div className="detail-meta-row">
            <span className={`badge ${sc.cls}`}>{sc.label}</span>
            <span className="meta-sep">·</span>
            <span className="detail-category">{problem.category}</span>
            <span className="meta-sep">·</span>
            <span className="detail-location-inline">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {problem.location}
            </span>
          </div>
        </div>

        {/* Story Banner */}
        <div className="story-banner animate-fade-up">
          <div className="story-icon">💬</div>
          <div>
            <p className="story-label">Community Story</p>
            <p className="story-text">"{problem.story}"</p>
          </div>
        </div>

        {/* State Machine */}
        <StateMachineBar status={taskStatus} />

        {/* Tabs */}
        <div className="detail-tabs">
          <button
            className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >📋 Overview</button>
          <button
            className={`detail-tab ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >📊 Fund Ledger</button>
        </div>

        {activeTab === 'overview' ? (
          <div className="detail-grid">

            {/* ── LEFT COLUMN ── */}
            <div className="detail-left">

              {/* SECTION A: Problem Info */}
              <section className="section animate-fade-up">
                <p className="section-title">Section A — Problem Info</p>
                <div className="problem-before-img-wrap">
                  <img src={problem.beforeImage} alt="Before" className="before-img" />
                  <span className="img-label-tag before-tag">📸 Before</span>
                </div>
                <p className="detail-desc">{problem.description}</p>

                <div className="detail-info-chips">
                  <div className="info-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {problem.location}
                  </div>
                  <div className="info-chip">
                    🏷️ {problem.category}
                  </div>
                </div>

                <div className="joined-row">
                  <div className="joined-avatars">
                    {[...Array(Math.min(5, joinedCount))].map((_, i) => (
                      <div key={i} className="joined-avatar" style={{ '--delay': `${i * 0.1}s` }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {joinedCount > 5 && <div className="joined-avatar more">+{joinedCount - 5}</div>}
                  </div>
                  <span className={`joined-count ${joinBumping ? 'animate-count-pop' : ''}`}>
                    <strong>{joinedCount}</strong> people joined
                  </span>
                </div>

                <div className="section-actions">
                  <button
                    className={`btn btn-lg ${hasJoined ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={handleJoin}
                    disabled={hasJoined}
                    id="btn-join-cause"
                  >
                    {hasJoined ? '✓ Joined!' : '👥 Join Cause'}
                  </button>
                </div>
              </section>

              {/* SECTION C: Task Action */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <p className="section-title">Section C — Task Action</p>

                <div className="task-card">
                  <div className="task-header">
                    <div className="task-icon-wrap">🛠️</div>
                    <div>
                      <p className="task-title-label">Task</p>
                      <p className="task-title-text">{problem.task}</p>
                    </div>
                  </div>

                  {/* Micro Identity */}
                  <div className="volunteer-identity">
                    <div className="volunteer-avatar">
                      {problem.volunteer.name[0]}
                    </div>
                    <div className="volunteer-info">
                      <div className="volunteer-name">
                        👤 {problem.volunteer.name}
                        <span className="volunteer-role">{problem.volunteer.role}</span>
                      </div>
                      <div className="volunteer-stats">
                        {starRating(problem.volunteer.rating)}
                        <span className="completed-count">· {problem.volunteer.completedTasks} tasks done</span>
                      </div>
                    </div>
                    {taskStatus !== 'OPEN' && (
                      <span className="assigned-chip">Assigned</span>
                    )}
                  </div>

                  {/* Status-based UI */}
                  {taskStatus === 'OPEN' && (
                    <button
                      className="btn btn-blue btn-lg take-task-btn"
                      onClick={handleTakeTask}
                      id="btn-take-task"
                    >
                      🙋 Take This Task
                    </button>
                  )}
                  {taskStatus === 'LOCKED' && (
                    <div className="task-locked-state">
                      <div className="alert alert-amber">
                        🔒 <strong>Task Locked</strong> – Funds reserved for {problem.volunteer.name}
                      </div>
                    </div>
                  )}
                  {taskStatus === 'VERIFYING' && (
                    <div className="task-verifying-state">
                      <div className="alert alert-info">
                        🤖 <strong>AI Verifying</strong> – Proof under review...
                      </div>
                    </div>
                  )}
                  {taskStatus === 'COMPLETED' && (
                    <div className="task-completed-state animate-fade-in">
                      <div className="alert alert-success">
                        ✅ <strong>Completed by {problem.volunteer.name}</strong>
                        <span className="impact-score-inline">🌍 Impact Score: 92%</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION D: Proof Upload */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <p className="section-title">Section D — Proof Upload</p>

                {taskStatus === 'OPEN' && (
                  <div className="proof-locked-msg">
                    <span>🔒 Take the task first to unlock proof upload</span>
                  </div>
                )}

                {taskStatus === 'LOCKED' && (
                  <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                    <div className="upload-icon">📷</div>
                    <p className="upload-title">Upload Proof of Work</p>
                    <p className="upload-sub">Click to select an image (JPG, PNG, WEBP)</p>
                    <button className="btn btn-blue" type="button">Choose Photo</button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden-file-input"
                      onChange={handleFileChange}
                      id="proof-upload-input"
                    />
                  </div>
                )}

                {taskStatus === 'VERIFYING' && (
                  <div className="verifying-state animate-fade-in">
                    <div className="ai-verify-card">
                      <div className="ai-verify-animation">
                        <div className="spinner spinner-lg" />
                        <div className="ai-ring ring-1" />
                        <div className="ai-ring ring-2" />
                      </div>
                      <p className="ai-verify-title">🤖 AI VERIFYING PROOF...</p>
                      <p className="ai-verify-sub">Analyzing image, cross-referencing location data, confirming task completion...</p>
                      <div className="verify-steps">
                        <div className="verify-step done">✓ Image received</div>
                        <div className="verify-step done">✓ Content analyzed</div>
                        <div className="verify-step active">⟳ Comparing before/after...</div>
                      </div>
                    </div>
                  </div>
                )}

                {taskStatus === 'COMPLETED' && (
                  <div className="verified-state animate-fade-in">
                    <div className="verified-card">
                      <div className="verified-icon animate-success">✅</div>
                      <p className="verified-title">Verified Successfully!</p>
                      <div className="verified-metrics">
                        <div className="v-metric">
                          <span className="v-metric-value accent">Rs. {problem.funded.toLocaleString()}</span>
                          <span className="v-metric-label">Funds Released</span>
                        </div>
                        <div className="v-metric-divider" />
                        <div className="v-metric">
                          <span className="v-metric-value">100%</span>
                          <span className="v-metric-label">Progress</span>
                        </div>
                        <div className="v-metric-divider" />
                        <div className="v-metric">
                          <span className="v-metric-value blue">92%</span>
                          <span className="v-metric-label">Impact Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="detail-right">

              {/* SECTION B: Trust Signal */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <p className="section-title">Section B — Trust Signal</p>

                <div className="funded-amount">
                  <span className="funded-label">Total Funded</span>
                  <span className="funded-value">Rs. {problem.funded.toLocaleString()}</span>
                </div>

                <div className="progress-wrap">
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-labels">
                    <span className="progress-pct">{progress}% Complete</span>
                    {taskStatus === 'COMPLETED' && (
                      <span className="progress-done-tag">Funds Released ✓</span>
                    )}
                  </div>
                </div>

                <div className={`trust-status-box ${taskStatus.toLowerCase()}`}>
                  {taskStatus === 'OPEN' && (
                    <>
                      <div className="ts-icon">🔓</div>
                      <div>
                        <p className="ts-title">Funds in Escrow</p>
                        <p className="ts-sub">Rs. {problem.funded.toLocaleString()} held securely until work is verified</p>
                      </div>
                    </>
                  )}
                  {taskStatus === 'LOCKED' && (
                    <>
                      <div className="ts-icon">🔒</div>
                      <div>
                        <p className="ts-title">Funds Reserved</p>
                        <p className="ts-sub">Rs. {problem.funded.toLocaleString()} reserved for {problem.volunteer.name}</p>
                      </div>
                    </>
                  )}
                  {taskStatus === 'VERIFYING' && (
                    <>
                      <div className="ts-icon">🤖</div>
                      <div>
                        <p className="ts-title">Verifying Proof</p>
                        <p className="ts-sub">AI is confirming work completion before releasing funds</p>
                      </div>
                    </>
                  )}
                  {taskStatus === 'COMPLETED' && (
                    <>
                      <div className="ts-icon">💚</div>
                      <div>
                        <p className="ts-title">Funds Released!</p>
                        <p className="ts-sub">Rs. {problem.funded.toLocaleString()} paid to {problem.volunteer.name} after verification</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Donor Summary */}
                <div className="donor-summary">
                  <p className="donor-summary-label">Donors</p>
                  {problem.donations && problem.donations.length > 0 ? (
                    problem.donations.map((d, i) => (
                      <div key={i} className="donor-row">
                        <div className="donor-avatar">{d.donor[0]}</div>
                        <span className="donor-name">{d.donor}</span>
                        <span className="donor-amount">Rs. {d.amount.toLocaleString()}</span>
                        <span className={`donor-status ${ledgerPaid ? 'paid' : 'escrow'}`}>
                          {ledgerPaid ? 'PAID' : d.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="no-donors-msg">
                      <span>💡 No donors yet — be the first to fund this problem</span>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION E: Visual Proof */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <p className="section-title">Section E — Visual Proof</p>

                <div className="before-after-grid">
                  <div className="ba-panel">
                    <div className="ba-img-wrap">
                      <img src={problem.beforeImage} alt="Before" className="ba-img" />
                    </div>
                    <div className="ba-label before-label">📸 Before</div>
                  </div>
                  <div className="ba-panel">
                    <div className="ba-img-wrap">
                      {displayAfterImage ? (
                        <>
                          <img src={displayAfterImage} alt="After" className="ba-img" />
                          {taskStatus === 'COMPLETED' && (
                            <div className="ba-verified-badge animate-success">✅ Verified</div>
                          )}
                        </>
                      ) : (
                        <div className="ba-placeholder">
                          <span className="ba-placeholder-icon">📤</span>
                          <span>After image will appear here once proof is uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="ba-label after-label">
                      {displayAfterImage ? '✅ After (Verified)' : '⏳ Awaiting Proof'}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* ── LEDGER TAB ── */
          <div className="ledger-inline animate-fade-in">
            <InlineLedger problem={problem} ledgerPaid={ledgerPaid} taskStatus={taskStatus} />
          </div>
        )}
      </div>
    </div>
  )
}

function InlineLedger({ problem, ledgerPaid, taskStatus }) {
  const typeConfig = {
    DEPOSIT: { icon: '💰', label: 'Deposit', color: 'var(--accent)' },
    RESERVE: { icon: '🔒', label: 'Reserved', color: 'var(--amber)' },
    RELEASE: { icon: '💸', label: 'Released', color: 'var(--green)' },
    BALANCE: { icon: '🏦', label: 'Pool Balance', color: 'var(--blue)' },
  }

  const getEntryStatus = (entry) => {
    if (entry.type === 'RELEASE') return ledgerPaid ? 'PAID' : 'PENDING'
    return entry.status
  }

  const statusCls = {
    ESCROW: 'le-status-escrow',
    RESERVED: 'le-status-reserved',
    PAID: 'le-status-paid',
    PENDING: 'le-status-pending',
    POOL: 'le-status-pool',
  }

  return (
    <div className="ledger-view">
      <div className="ledger-header-row">
        <div>
          <h2 className="ledger-title">Fund Ledger</h2>
          <p className="ledger-sub">Transparent fund flow for: {problem.title}</p>
        </div>
        <div className={`ledger-status-badge ${taskStatus === 'COMPLETED' ? 'completed' : 'active'}`}>
          {taskStatus === 'COMPLETED' ? '✅ Funds Released' : '🔒 Funds in Escrow'}
        </div>
      </div>

      <div className="ledger-summary-cards">
        <div className="ls-card">
          <span className="ls-card-label">Total Raised</span>
          <span className="ls-card-value accent">Rs. {problem.funded.toLocaleString()}</span>
        </div>
        <div className="ls-card">
          <span className="ls-card-label">Volunteer Payout</span>
          <span className="ls-card-value">{ledgerPaid ? `Rs. ${(problem.funded * 0.5).toLocaleString()}` : 'Pending'}</span>
        </div>
        <div className="ls-card">
          <span className="ls-card-label">Status</span>
          <span className={`ls-card-value ${ledgerPaid ? 'green' : 'amber'}`}>
            {ledgerPaid ? 'COMPLETED' : taskStatus}
          </span>
        </div>
        <div className="ls-card">
          <span className="ls-card-label">Donors</span>
          <span className="ls-card-value blue">{problem.donations.length}</span>
        </div>
      </div>

      <div className="ledger-table">
        <div className="lt-head">
          <span>From</span>
          <span>→</span>
          <span>To</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {problem.ledgerEntries && problem.ledgerEntries.length > 0 ? (
          problem.ledgerEntries.map((entry) => {
            const tc = typeConfig[entry.type] || {}
            const status = getEntryStatus(entry)
            return (
              <div key={entry.id} className={`lt-row ${status === 'PAID' ? 'lt-row-paid' : ''}`}>
                <span className="lt-from">{entry.from}</span>
                <span className="lt-arrow">→</span>
                <span className="lt-to">{entry.to}</span>
                <span className="lt-amount">Rs. {entry.amount.toLocaleString()}</span>
                <span className="lt-type" style={{ color: tc.color }}>
                  {tc.icon} {tc.label}
                </span>
                <span className={`lt-status ${statusCls[status] || ''}`}>{status}</span>
                <span className="lt-time">{entry.time}</span>
              </div>
            )
          })
        ) : (
          <div className="lt-row" style={{ gridColumn: '1/-1', color: 'var(--text-muted)', padding: '20px 16px', fontSize: 13 }}>
            📋 No ledger entries yet — entries appear once donors fund this problem
          </div>
        )}
      </div>

      {taskStatus === 'COMPLETED' && (
        <div className="ledger-complete-banner animate-fade-in">
          <span className="lcb-icon">🎉</span>
          <div>
            <strong>Trust Loop Complete!</strong>
            <span> Funds released to {problem.volunteer.name} after verified proof. All transactions logged.</span>
          </div>
        </div>
      )}
    </div>
  )
}
