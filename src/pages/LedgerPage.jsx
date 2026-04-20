import { useState } from 'react'
import { problems } from '../data/problems'
import './LedgerPage.css'

const TYPE_CONFIG = {
  DEPOSIT: { icon: '💰', label: 'Deposit', color: 'var(--accent)' },
  RESERVE: { icon: '🔒', label: 'Reserved', color: 'var(--amber)' },
  RELEASE: { icon: '💸', label: 'Released', color: 'var(--green)' },
  BALANCE: { icon: '🏦', label: 'Pool Balance', color: 'var(--blue)' },
}

const STATUS_CLS = {
  ESCROW: 'ls-escrow',
  RESERVED: 'ls-reserved',
  PAID: 'ls-paid',
  PENDING: 'ls-pending',
  POOL: 'ls-pool',
}

export default function LedgerPage() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0].id)
  const problem = problems.find((p) => p.id === selectedProblem)
  const isCompleted = problem.displayStatus === 'Completed'

  const totalFunded = problems.reduce((s, p) => s + p.funded, 0)
  const totalJoined = problems.reduce((s, p) => s + p.joinedCount, 0)
  const completedCount = problems.filter((p) => p.displayStatus === 'Completed').length

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
              <p className="ps-value">Rs. {totalFunded.toLocaleString()}</p>
              <p className="ps-label">Total Funded</p>
            </div>
          </div>
          <div className="ps-card">
            <div className="ps-icon">🧩</div>
            <div>
              <p className="ps-value">{problems.length}</p>
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
              <span className="sum-label">Total Raised</span>
              <span className="sum-value accent">Rs. {problem.funded.toLocaleString()}</span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">Volunteer Payout</span>
              <span className={`sum-value ${isCompleted ? 'green' : ''}`}>
                Rs. {(problem.funded * 0.5).toLocaleString()}
              </span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">Remaining Pool</span>
              <span className="sum-value blue">Rs. {(problem.funded * 0.5).toLocaleString()}</span>
            </div>
            <div className="lmc-sum-divider" />
            <div className="lmc-sum-item">
              <span className="sum-label">Donors</span>
              <span className="sum-value">{problem.donations.length}</span>
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
                <div className="ff-step-amount">Locked</div>
              </div>
              <div className="ff-arrow">→</div>
              <div className="ff-step verify">
                <div className="ff-step-icon">🤖</div>
                <div className="ff-step-name">AI Verification</div>
                <div className="ff-step-amount">Proof Check</div>
              </div>
              <div className="ff-arrow">→</div>
              <div className={`ff-step volunteer ${isCompleted ? 'paid' : ''}`}>
                <div className="ff-step-icon">🙋</div>
                <div className="ff-step-name">{problem.volunteer.name}</div>
                <div className="ff-step-amount">
                  {isCompleted ? `Rs. ${(problem.funded * 0.5).toLocaleString()} PAID` : 'Pending'}
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
                const status = isCompleted && entry.type === 'RELEASE' ? 'PAID'
                  : isCompleted && entry.type === 'DEPOSIT' ? 'PAID'
                  : entry.status
                return (
                  <div
                    key={entry.id}
                    className={`tx-row ${status === 'PAID' ? 'tx-paid' : ''} ${status === 'PENDING' ? 'tx-pending' : ''}`}
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
                CivicTrust ensures every stakeholder can see exactly where the money went.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
