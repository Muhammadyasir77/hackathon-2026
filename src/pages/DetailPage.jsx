import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StateMachineBar from '../components/StateMachineBar'
import './DetailPage.css'

export default function DetailPage({ onDonate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { problems, user, donations, joinProblem, takeTask, releaseBeforeFund, releaseAfterFund } = useApp()
  const problem = problems.find((p) => String(p.id) === String(id))

  const volunteerName = user?.name || 'Volunteer'

  // Derive persisted state from global problem object
  const isCompleted = problem?.status === 'COMPLETED' || problem?.displayStatus === 'Completed'
  const isInProgress = (problem?.volunteers?.length > 0) && !isCompleted
  const myVolunteer = problem?.volunteers?.find((v) => v.name === volunteerName)
  const hasJoinedGlobal = false // join is one-way; we track via session flag
  const beforePaid = myVolunteer?.status === 'before_paid' || myVolunteer?.status === 'completed'
  const fullyPaid = myVolunteer?.status === 'completed' || isCompleted

  // Local UI state
  const [hasJoined, setHasJoined] = useState(false)
  const [joinBumping, setJoinBumping] = useState(false)
  const [taskStatus, setTaskStatus] = useState(
    isCompleted ? 'COMPLETED' : isInProgress ? 'LOCKED' : 'OPEN'
  )
  const [beforeImage, setBeforeImage] = useState(null)
  const [beforeVerifying, setBeforeVerifying] = useState(false)
  const [beforeVerified, setBeforeVerified] = useState(beforePaid)
  const [afterImage, setAfterImage] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [verifyFailed, setVerifyFailed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const beforeRef = useRef()
  const afterRef = useRef()

  if (!problem) {
    return (
      <div className="not-found container">
        <h2>Problem not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Go Home</button>
      </div>
    )
  }

  const funded = problem.funded || 0
  const release30 = Math.round(funded * 0.3)
  const release70 = funded - release30
  const releasedFund = problem.releasedFund || 0
  const reservedFund = problem.reservedFund ?? funded

  // ── Handlers ──
  const handleJoin = () => {
    if (hasJoined) return
    setHasJoined(true)
    setJoinBumping(true)
    joinProblem(problem.id)
    setTimeout(() => setJoinBumping(false), 500)
  }

  const handleTakeTask = () => {
    if (taskStatus !== 'OPEN') return
    takeTask(problem.id, volunteerName)
    setTaskStatus('LOCKED')
  }

  const handleBeforeImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBeforeImage(URL.createObjectURL(file))
    setBeforeVerifying(true)  // start spinner
    setTimeout(() => {
      setBeforeVerifying(false)
      setBeforeVerified(true)
      releaseBeforeFund(problem.id, volunteerName)
    }, 2500)  // 2.5s AI verification
  }

  const handleAfterImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAfterImage(URL.createObjectURL(file))
  }

  const handleVerify = () => {
    if (!afterImage) return
    setVerifying(true)
    setVerifyFailed(false)
    setTimeout(() => {
      setVerifying(false)
      const success = Math.random() > 0.15 // 85% success rate
      if (success) {
        setTaskStatus('COMPLETED')
        releaseAfterFund(problem.id, volunteerName)
      } else {
        setVerifyFailed(true)
      }
    }, 3000)
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: problem.title, url })
    else navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
  }

  const joinedCount = problem.joinedCount ?? 0
  const volunteersCount = problem.volunteers?.length ?? 0

  // Donations for this specific problem
  const problemDonations = (donations || []).filter((d) => d.problemId === problem.id)
  const totalDonated = problemDonations.reduce((s, d) => s + d.amount, 0)

  // Community badge
  const communityBadge =
    problemDonations.length >= 5 || totalDonated >= 5000
      ? { label: '🏆 Highly Supported', cls: 'badge-gold' }
      : problemDonations.length >= 2 || totalDonated >= 1000
      ? { label: '💰 Community Funded', cls: 'badge-accent' }
      : null

  const statusConfig = {
    OPEN:      { label: 'Open',      cls: 'badge-open' },
    LOCKED:    { label: 'In Progress', cls: 'badge-locked' },
    VERIFYING: { label: 'Verifying', cls: 'badge-verifying' },
    COMPLETED: { label: 'Completed', cls: 'badge-completed' },
  }
  const sc = statusConfig[taskStatus] || statusConfig.OPEN

  return (
    <div className="detail-page">
      <div className="container">

        {/* Topbar */}
        <div className="detail-topbar">
          <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <div className="detail-title-row">
            <h1 className="detail-main-title">{problem.title}</h1>
            <button className="btn btn-ghost btn-sm" onClick={handleShare}>Share</button>
          </div>
          <div className="detail-meta-row">
            <span className={`badge ${sc.cls}`}>{sc.label}</span>
            <span className="meta-sep">·</span>
            <span className="detail-category">{problem.category}</span>
            <span className="meta-sep">·</span>
            <span className="detail-location-inline">{problem.location}</span>
          </div>
        </div>

        {/* Story */}
        <div className="story-banner animate-fade-up">
          <div className="story-icon">💬</div>
          <div>
            <p className="story-label">Community Story</p>
            <p className="story-text">"{problem.story}"</p>
          </div>
        </div>

        <StateMachineBar status={taskStatus} />

        {/* Tabs */}
        <div className="detail-tabs">
          <button className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview</button>
          <button className={`detail-tab ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>📊 Fund Ledger</button>
        </div>

        {activeTab === 'overview' ? (
          <div className="detail-grid">

            {/* LEFT */}
            <div className="detail-left">

              {/* Section A: Problem Info */}
              <section className="section animate-fade-up">
                <p className="section-title">Section A — Problem Info</p>
                <div className="problem-before-img-wrap">
                  <img src={problem.beforeImage} alt="Before" className="before-img" />
                  <span className="img-label-tag before-tag">📸 Before</span>
                </div>
                <p className="detail-desc">{problem.description}</p>

                <div className="joined-row">
                  <div className="joined-avatars">
                    {[...Array(Math.min(5, joinedCount))].map((_, i) => (
                      <div key={i} className="joined-avatar">{String.fromCharCode(65 + i)}</div>
                    ))}
                    {joinedCount > 5 && <div className="joined-avatar more">+{joinedCount - 5}</div>}
                  </div>
                  <span className={`joined-count ${joinBumping ? 'animate-count-pop' : ''}`}>
                    <strong>{joinedCount}</strong> people joined
                    {volunteersCount > 0 && <> · <strong>{volunteersCount}</strong> volunteer{volunteersCount > 1 ? 's' : ''}</>}
                  </span>
                </div>

                <div className="section-actions">
                  {communityBadge && (
                    <span className={`community-badge ${communityBadge.cls}`}>{communityBadge.label}</span>
                  )}
                  <button
                    className={`btn btn-lg ${hasJoined ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={handleJoin}
                    disabled={hasJoined}
                    id="btn-join-cause"
                  >
                    {hasJoined ? '✓ Joined!' : '👥 Join Cause'}
                  </button>
                  <button
                    className="btn btn-donate btn-lg"
                    onClick={onDonate}
                    id="btn-detail-donate"
                  >
                    💰 Donate
                  </button>
                </div>
              </section>

              {/* Recent Donations */}
              {problemDonations.length > 0 && (
                <section className="section animate-fade-up" style={{ animationDelay: '0.05s' }}>
                  <p className="section-title">Recent Donations</p>
                  <div className="recent-donations-list">
                    {problemDonations.slice(0, 5).map((d) => (
                      <div key={d.id} className="rd-row">
                        <div className="rd-avatar">{d.donorName[0]}</div>
                        <div className="rd-info">
                          <span className="rd-name">{d.donorName}</span>
                          {d.message && <span className="rd-msg">"{d.message}"</span>}
                        </div>
                        <span className="rd-amount">Rs. {d.amount.toLocaleString()}</span>
                        <span className="rd-status">ESCROW</span>
                        <span className="rd-time">{d.time}</span>
                      </div>
                    ))}
                    {problemDonations.length > 5 && (
                      <p className="rd-more">+{problemDonations.length - 5} more donations</p>
                    )}
                  </div>
                </section>
              )}

              {/* Section C: Task */}
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

                  {volunteersCount > 0 && (
                    <div className="volunteers-list">
                      <p className="volunteers-label">🙋 Assigned Volunteers ({volunteersCount})</p>
                      {problem.volunteers.map((v) => (
                        <div key={v.id} className="volunteer-row">
                          <div className="volunteer-avatar">{v.name[0]}</div>
                          <div className="vol-info">
                            <span className="vol-name">{v.name}</span>
                            <div className="vol-fund-breakdown">
                              <span className="vfb-item">Assigned: <strong>Rs. {(v.assignedFund || 0).toLocaleString()}</strong></span>
                              <span className="vfb-sep">·</span>
                              <span className="vfb-item green">Released: <strong>Rs. {(v.releasedFund || 0).toLocaleString()}</strong></span>
                              <span className="vfb-sep">·</span>
                              <span className="vfb-item amber">Remaining: <strong>Rs. {(v.remainingFund ?? v.assignedFund ?? 0).toLocaleString()}</strong></span>
                            </div>
                          </div>
                          <span className={`vol-status-chip ${v.status}`}>{v.status.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {taskStatus === 'OPEN' && (
                    <button className="btn btn-blue btn-lg take-task-btn" onClick={handleTakeTask} id="btn-take-task">
                      🙋 Take This Task
                    </button>
                  )}
                  {taskStatus === 'LOCKED' && (
                    <div className="alert alert-amber">
                      🔒 <strong>Task Locked</strong> — Funds reserved. Upload before image to receive 30%.
                    </div>
                  )}
                  {taskStatus === 'COMPLETED' && (
                    <div className="alert alert-success animate-fade-in">
                      ✅ <strong>Task Completed</strong> — Full funds released to volunteer.
                    </div>
                  )}
                </div>
              </section>

              {/* Section D: Proof Upload */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <p className="section-title">Section D — Proof Upload (2-Step)</p>

                {taskStatus === 'OPEN' && (
                  <div className="proof-locked-msg">
                    <span>🔒 Take the task first to unlock proof upload</span>
                  </div>
                )}

                {taskStatus === 'LOCKED' && (
                  <div className="two-step-upload">
                    {/* STEP 1: Before Image → 30% */}
                    <div className={`upload-step ${beforeVerified ? 'step-done' : 'step-active'}`}>
                      <div className="step-header">
                        <span className="step-num">Step 1</span>
                        <span className="step-desc">Upload Before Image → Receive Rs. {release30.toLocaleString()} (30%)</span>
                      </div>
                      {beforeImage ? (
                        <div className="step-img-preview">
                          <img src={beforeImage} alt="Before uploaded" />
                          {beforeVerifying ? (
                            /* AI spinner for Step 1 */
                            <div className="ai-verify-card step1-verify">
                              <div className="ai-verify-animation">
                                <div className="spinner spinner-lg" />
                                <div className="ai-ring ring-1" />
                                <div className="ai-ring ring-2" />
                              </div>
                              <p className="ai-verify-title">🤖 Verifying Image...</p>
                              <p className="ai-verify-sub">Confirming image authenticity before releasing 30%...</p>
                              <div className="verify-steps">
                                <div className="verify-step done">✓ Image received</div>
                                <div className="verify-step active">⟳ Checking authenticity...</div>
                              </div>
                            </div>
                          ) : beforeVerified ? (
                            <div className="step-paid-badge">✅ Rs. {release30.toLocaleString()} Released — 30% paid to volunteer</div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="upload-zone" onClick={() => beforeRef.current.click()}>
                          <div className="upload-icon">📷</div>
                          <p className="upload-title">Upload Before Image</p>
                          <p className="upload-sub">Proof of the problem before work begins</p>
                          <button className="btn btn-blue" type="button">Choose Photo</button>
                          <input ref={beforeRef} type="file" accept="image/*" className="hidden-file-input" onChange={handleBeforeImage} id="before-upload-input" />
                        </div>
                      )}
                    </div>

                    {/* STEP 2: After Image + Verify → 70% — only unlocked after Step 1 verified */}
                    {beforeVerified && !beforeVerifying && (
                      <div className="upload-step step-active">
                        <div className="step-header">
                          <span className="step-num">Step 2</span>
                          <span className="step-desc">Upload After Image + Verify → Receive Rs. {release70.toLocaleString()} (70%)</span>
                        </div>
                        {afterImage ? (
                          <div className="step-img-preview">
                            <img src={afterImage} alt="After uploaded" />
                            {verifying ? (
                              <div className="ai-verify-card">
                                <div className="spinner spinner-lg" />
                                <p className="ai-verify-title">🤖 AI Verifying...</p>
                              </div>
                            ) : verifyFailed ? (
                              <div className="alert alert-red">
                                ❌ Verification failed. Please re-upload a clearer image.
                                <button className="btn btn-sm btn-ghost" style={{marginTop:8}} onClick={() => { setAfterImage(null); setVerifyFailed(false) }}>Try Again</button>
                              </div>
                            ) : (
                              <button className="btn btn-primary btn-lg" onClick={handleVerify} id="btn-verify-work">
                                🤖 Verify Work
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="upload-zone" onClick={() => afterRef.current.click()}>
                            <div className="upload-icon">📤</div>
                            <p className="upload-title">Upload After Image</p>
                            <button className="btn btn-blue" type="button">Choose Photo</button>
                            <input ref={afterRef} type="file" accept="image/*" className="hidden-file-input" onChange={handleAfterImage} id="after-upload-input" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {taskStatus === 'COMPLETED' && (
                  <div className="verified-state animate-fade-in">
                    <div className="verified-card">
                      <div className="verified-icon animate-success">✅</div>
                      <p className="verified-title">Verified Successfully!</p>
                      <div className="verified-metrics">
                        <div className="v-metric">
                          <span className="v-metric-value accent">Rs. {funded.toLocaleString()}</span>
                          <span className="v-metric-label">Total Released</span>
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

            {/* RIGHT */}
            <div className="detail-right">

              {/* Section B: Trust Signal */}
              <section className="section animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <p className="section-title">Section B — Fund Breakdown</p>

                <div className="funded-amount">
                  <span className="funded-label">Required Fund</span>
                  <span className="funded-value">Rs. {funded.toLocaleString()}</span>
                </div>

                {/* Fund breakdown bars */}
                <div className="fund-breakdown">
                  <div className="fb-row">
                    <span className="fb-label">🔒 Reserved</span>
                    <span className="fb-val amber">Rs. {reservedFund.toLocaleString()}</span>
                  </div>
                  <div className="fb-row">
                    <span className="fb-label">✅ Released</span>
                    <span className="fb-val green">Rs. {releasedFund.toLocaleString()}</span>
                  </div>
                  <div className="fb-row">
                    <span className="fb-label">📊 Remaining</span>
                    <span className="fb-val">{taskStatus === 'COMPLETED' ? 'Rs. 0' : `Rs. ${(funded - releasedFund).toLocaleString()}`}</span>
                  </div>
                </div>

                <div className="progress-wrap" style={{marginTop:16}}>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${taskStatus === 'COMPLETED' ? 100 : Math.round((releasedFund / funded) * 100)}%` }} />
                  </div>
                  <div className="progress-labels">
                    <span className="progress-pct">{taskStatus === 'COMPLETED' ? 100 : Math.round((releasedFund / funded) * 100)}% Complete</span>
                    {taskStatus === 'COMPLETED' && <span className="progress-done-tag">Funds Released ✓</span>}
                  </div>
                </div>

                <div className={`trust-status-box ${taskStatus.toLowerCase()}`}>
                  {taskStatus === 'OPEN' && <><div className="ts-icon">🔓</div><div><p className="ts-title">Funds in Escrow</p><p className="ts-sub">Rs. {funded.toLocaleString()} held until work verified</p></div></>}
                  {taskStatus === 'LOCKED' && <><div className="ts-icon">🔒</div><div><p className="ts-title">Funds Reserved</p><p className="ts-sub">30% released on before image · 70% on verification</p></div></>}
                  {taskStatus === 'COMPLETED' && <><div className="ts-icon">💚</div><div><p className="ts-title">Funds Released!</p><p className="ts-sub">Rs. {funded.toLocaleString()} paid after verified proof</p></div></>}
                </div>

                {/* Donors */}
                <div className="donor-summary">
                  <p className="donor-summary-label">Donors</p>
                  {problem.donations?.length > 0 ? problem.donations.map((d, i) => (
                    <div key={i} className="donor-row">
                      <div className="donor-avatar">{d.donor[0]}</div>
                      <span className="donor-name">{d.donor}</span>
                      <span className="donor-amount">Rs. {d.amount.toLocaleString()}</span>
                      <span className={`donor-status ${taskStatus === 'COMPLETED' ? 'paid' : 'escrow'}`}>
                        {taskStatus === 'COMPLETED' ? 'PAID' : d.status}
                      </span>
                    </div>
                  )) : (
                    <div className="no-donors-msg"><span>💡 No donors yet</span></div>
                  )}
                </div>
              </section>

              {/* Section E: Visual Proof */}
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
                      {(afterImage || (taskStatus === 'COMPLETED' && problem.afterImagePlaceholder)) ? (
                        <>
                          <img src={afterImage || problem.afterImagePlaceholder} alt="After" className="ba-img" />
                          {taskStatus === 'COMPLETED' && <div className="ba-verified-badge animate-success">✅ Verified</div>}
                        </>
                      ) : (
                        <div className="ba-placeholder">
                          <span className="ba-placeholder-icon">📤</span>
                          <span>After image appears once proof is uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="ba-label after-label">
                      {taskStatus === 'COMPLETED' ? '✅ After (Verified)' : '⏳ Awaiting Proof'}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="ledger-inline animate-fade-in">
            <InlineLedger problem={problem} taskStatus={taskStatus} />
          </div>
        )}
      </div>
    </div>
  )
}

function InlineLedger({ problem, taskStatus }) {
  const funded = problem.funded || 0
  const release30 = Math.round(funded * 0.3)
  const release70 = funded - release30

  const typeConfig = {
    DEPOSIT:    { icon: '💰', label: 'Deposit',     color: 'var(--accent)' },
    RESERVE:    { icon: '🔒', label: 'Reserved',    color: 'var(--amber)'  },
    RELEASE_30: { icon: '💸', label: '30% Release', color: 'var(--green)'  },
    RELEASE_70: { icon: '✅', label: '70% Release', color: 'var(--green)'  },
    RELEASE:    { icon: '💸', label: 'Released',    color: 'var(--green)'  },
    PAYMENT:    { icon: '✅', label: 'Payment',     color: 'var(--green)'  },
    BALANCE:    { icon: '🏦', label: 'Pool Balance',color: 'var(--blue)'   },
  }

  const statusCls = {
    ESCROW: 'le-status-escrow', RESERVED: 'le-status-reserved',
    PAID: 'le-status-paid', PENDING: 'le-status-pending', POOL: 'le-status-pool',
  }

  const isCompleted = taskStatus === 'COMPLETED'
  const releasedFund = problem.releasedFund || 0
  const reservedFund = problem.reservedFund ?? funded

  return (
    <div className="ledger-view">
      <div className="ledger-header-row">
        <div>
          <h2 className="ledger-title">Fund Ledger</h2>
          <p className="ledger-sub">Transparent fund flow for: {problem.title}</p>
        </div>
        <div className={`ledger-status-badge ${isCompleted ? 'completed' : 'active'}`}>
          {isCompleted ? '✅ Funds Released' : '🔒 Funds in Escrow'}
        </div>
      </div>

      <div className="ledger-summary-cards">
        <div className="ls-card"><span className="ls-card-label">Total Fund</span><span className="ls-card-value accent">Rs. {funded.toLocaleString()}</span></div>
        <div className="ls-card"><span className="ls-card-label">Reserved</span><span className="ls-card-value amber">Rs. {reservedFund.toLocaleString()}</span></div>
        <div className="ls-card"><span className="ls-card-label">Released</span><span className="ls-card-value green">Rs. {releasedFund.toLocaleString()}</span></div>
        <div className="ls-card"><span className="ls-card-label">Volunteers</span><span className="ls-card-value blue">{problem.volunteers?.length || 0}</span></div>
      </div>

      <div className="ledger-table">
        <div className="lt-head">
          <span>From</span><span>→</span><span>To</span><span>Amount</span><span>Type</span><span>Status</span><span>Time</span>
        </div>
        {problem.ledgerEntries?.length > 0 ? problem.ledgerEntries.map((entry) => {
          const tc = typeConfig[entry.type] || {}
          const status = entry.status
          return (
            <div key={entry.id} className={`lt-row ${status === 'PAID' ? 'lt-row-paid' : ''}`}>
              <span className="lt-from">{entry.from}</span>
              <span className="lt-arrow">→</span>
              <span className="lt-to">{entry.to}</span>
              <span className="lt-amount">Rs. {entry.amount.toLocaleString()}</span>
              <span className="lt-type" style={{ color: tc.color }}>{tc.icon} {tc.label}</span>
              <span className={`lt-status ${statusCls[status] || ''}`}>{status}</span>
              <span className="lt-time">{entry.time}</span>
            </div>
          )
        }) : (
          <div className="lt-row" style={{ gridColumn: '1/-1', color: 'var(--text-muted)', padding: '20px 16px', fontSize: 13 }}>
            📋 No ledger entries yet
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="ledger-complete-banner animate-fade-in">
          <span className="lcb-icon">🎉</span>
          <div><strong>Trust Loop Complete!</strong><span> All funds released after verified proof. Transactions logged.</span></div>
        </div>
      )}
    </div>
  )
}
