import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './LedgerPage.css'

const TYPE_CONFIG = {
  DEPOSIT:    { icon: '💰', label: 'Deposit',     color: 'var(--accent)' },
  DONATION:   { icon: '📚', label: 'Donation',    color: 'var(--green)'  },
  RESERVE:    { icon: '🔒', label: 'Reserved',    color: 'var(--amber)'  },
  RELEASE:    { icon: '💸', label: 'Released',    color: 'var(--green)'  },
  RELEASE_30: { icon: '💸', label: '30% Release', color: 'var(--green)'  },
  RELEASE_70: { icon: '✅', label: '70% Release', color: 'var(--green)'  },
  PAYMENT:    { icon: '✅', label: 'Payment',     color: 'var(--green)'  },
  BALANCE:    { icon: '🏦', label: 'Pool Balance',color: 'var(--blue)'   },
}

const STATUS_CLS = {
  ESCROW:   'ls-escrow',
  RESERVED: 'ls-reserved',
  PAID:     'ls-paid',
  PAYMENT:  'ls-paid',
  PENDING:  'ls-pending',
  POOL:     'ls-pool',
}

export default function LedgerPage() {
  const { problems, totalFunds, totalProblems } = useApp()
  const [selectedProblem, setSelectedProblem] = useState(() => problems[0]?.id ?? null)

  // Always resolve from live problems (state may have changed since mount)
  const problem = problems.find((p) => p.id === selectedProblem) ?? problems[0]

  if (!problems.length) {
    return (
      <div className="ledger-page"><div className="container" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No problems posted yet. Post one on the home page!</p>
      </div></div>
    )
  }

  const isCompleted  = problem.displayStatus === 'Completed' || problem.status === 'COMPLETED'
  const isInProgress = (problem.volunteers?.length > 0) && !isCompleted
  const releasedFund = problem.releasedFund || 0
  const reservedFund = problem.reservedFund ?? problem.funded
  const totalJoined  = problems.reduce((s, p) => s + (p.joinedCount || 0), 0)
  const completedCount = problems.filter((p) => p.displayStatus === 'Completed' || p.status === 'COMPLETED').length
  // Primary volunteer for display
  const primaryVol = problem.volunteers?.[0]

  return (
    <div className="ledger-page">
      <div className="container">

        {/* Header */}
        <div className="lp-header">
          <div className="lp-header-text">
            <h1 className="lp-title">Fund Ledger</h1>
            <p className="lp-sub">
              Every rupee tracked. Every action logged. Trust built through transparency.
            </p>
          </div>
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            Live Ledger
          </div>
        </div>

        {/* Platform Stats */}
        <div className="platform-stats">
          <div className="ps-card">
            <div className="ps-icon">💰</div>
            <div>
              <p className="ps-value">Rs. {totalFunds.toLocaleString()}</p>
              <p className="ps-label">Total Funded</p>
            </div>
          </div>
          <div className="ps-card">
            <div className="ps-icon">🧩</div>
            <div>
              <p className="ps-value">{totalProblems}</p>
              <p className="ps-label">Problems Posted</p>
            </div>
          </div>
          <div className="ps-card">
            <div className="ps-icon">✅</div>
            <div>
              <p className="ps-value">{completedCount}</p>
              <p className="ps-label">Completed</p>
            </div>
          </div>
          <div className="ps-card">
            <div className="ps-icon">👥</div>
            <div>
              <p className="ps-value">{totalJoined}</p>
              <p className="ps-label">People Joined</p>
            </div>
          </div>
        </div>

        {/* Problem Selector */}
        <div className="problem-selector">
          <p className="ps-select-label">View Ledger For:</p>
          <div className="ps-tabs">
            {problems.map((p) => (
              <button
                key={p.id}
                className={`ps-tab ${selectedProblem === p.id ? 'active' : ''}`}
                onClick={() => setSelectedProblem(p.id)}
              >
                <span className={`ps-tab-dot ${p.displayStatus === 'Completed' ? 'green' : 'amber'}`} />
                <span className="ps-tab-label">{p.title.slice(0, 35)}...</span>
                <span className={`badge ${p.displayStatus === 'Completed' ? 'badge-completed' : 'badge-active'} ps-tab-badge`}>
                  {p.displayStatus}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="ledger-main-card">
          <div className="lmc-header">
            <div>
              <h2 className="lmc-title">{problem.title}</h2>
              <p className="lmc-meta">
                📍 {problem.location} &nbsp;·&nbsp; {problem.category}
              </p>
            </div>
            <div className={`lmc-status ${isCompleted ? 'completed' : 'active'}`}>
              {isCompleted ? '✅ Completed & Paid' : '🔒 Funds in Escrow'}
            </div>
          </div>

          {/* Summary Row */}
          <div className="lmc-summary">
            <div className="lmc-sum-item">
              <span className="sum-label">Required Fund</span>
              <span className="sum-value accent">Rs. {problem.funded.toLocaleString()}</span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">🔒 Reserved</span>
              <span className={`sum-value ${isInProgress ? 'amber' : ''}`}>
                Rs. {reservedFund.toLocaleString()}
              </span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">✅ Released</span>
              <span className={`sum-value ${releasedFund > 0 ? 'green' : ''}`}>
                Rs. {releasedFund.toLocaleString()}
              </span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">Donors</span>
              <span className="sum-value">{problem.donations?.length ?? 0}</span>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="fund-flow">
            <p className="ff-label">Fund Flow</p>
            <div className="ff-steps">
              <div className="ff-step donor">
                <div className="ff-step-icon">👥</div>
                <div className="ff-step-name">Donors</div>
                <div className="ff-step-amount">Rs. {problem.funded.toLocaleString()}</div>
              </div>
              <div className="ff-arrow">→</div>
              <div className="ff-step escrow">
                <div className="ff-step-icon">🏦</div>
                <div className="ff-step-name">Escrow Pool</div>
                <div className="ff-step-amount">
                  {isInProgress || isCompleted ? 'Locked → Releasing' : 'Locked'}
                </div>
              </div>
              <div className="ff-arrow">→</div>
              <div className="ff-step verify">
                <div className="ff-step-icon">🤖</div>
                <div className="ff-step-name">AI Verification</div>
                <div className="ff-step-amount">
                  {isCompleted ? 'Verified ✓' : isInProgress ? 'In Progress' : 'Proof Check'}
                </div>
              </div>
              <div className="ff-arrow">→</div>
              <div className={`ff-step volunteer ${releasedFund > 0 ? 'paid' : ''}`}>
                <div className="ff-step-icon">🙋</div>
                <div className="ff-step-name">
                  {primaryVol?.name || problem.volunteer?.name || 'Volunteer'}
                </div>
                <div className="ff-step-amount">
                  {releasedFund > 0
                    ? `Rs. ${releasedFund.toLocaleString()} ${isCompleted ? 'PAID' : 'PARTIAL'}`
                    : 'Pending'}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="transactions-section">
            <p className="tx-section-label">All Transactions</p>
            <div className="tx-table">
              <div className="tx-head">
                <span>From</span>
                <span>→</span>
                <span>To</span>
                <span>Amount</span>
                <span>Type</span>
                <span>Status</span>
                <span>Timestamp</span>
              </div>
              {problem.ledgerEntries.map((entry) => {
                const tc = TYPE_CONFIG[entry.type] || {}
                // Dynamic status: PAID entries stay PAID; RESERVED entries downgrade if completed
                const status = entry.status
                return (
                  <div
                    key={entry.id}
                    className={`tx-row ${status === 'PAID' ? 'tx-paid' : ''} ${status === 'RESERVED' ? 'tx-reserved' : ''} ${status === 'PENDING' ? 'tx-pending' : ''}`}
                  >
                    <span className="tx-from">{entry.from}</span>
                    <span className="tx-arrow">→</span>
                    <span className="tx-to">{entry.to}</span>
                    <span className="tx-amount">Rs. {entry.amount.toLocaleString()}</span>
                    <span className="tx-type" style={{ color: tc.color }}>
                      {tc.icon} {tc.label}
                    </span>
                    <span className={`tx-status ${STATUS_CLS[status] || ''}`}>{status}</span>
                    <span className="tx-time">{entry.time}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="tx-legend">
            <p className="tx-legend-label">Legend</p>
            <div className="tx-legend-items">
              <div className="legend-item"><span className="legend-dot escrow" />ESCROW – Funds locked, task open</div>
              <div className="legend-item"><span className="legend-dot reserved" />RESERVED – Task taken, payout pending</div>
              <div className="legend-item"><span className="legend-dot paid" />PAID – Work verified, funds released</div>
              <div className="legend-item"><span className="legend-dot pending" />PENDING – Awaiting verification</div>
              <div className="legend-item"><span className="legend-dot pool" />POOL – Remaining community pool</div>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="trust-statement">
          <div className="ts-content">
            <div className="ts-icon-large">🛡️</div>
            <div>
              <h3 className="ts-heading">Why This Ledger Matters</h3>
          <p className="ts-body">
                Every rupee donated, every task reserved, and every payout is recorded here.
                No funds move without verified proof. No trust without transparency.
                FixLedger ensures every stakeholder can see exactly where the money went.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
