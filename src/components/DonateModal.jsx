import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './DonateModal.css'

export default function DonateModal({ onClose, defaultProblemId = '' }) {
  const { problems, user, donate } = useApp()
  const [problemId, setProblemId] = useState(defaultProblemId || problems[0]?.id || '')
  const [amount, setAmount]       = useState('')
  const [message, setMessage]     = useState('')
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  const donorName = user?.name || 'Anonymous'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const amt = Number(amount)
    if (!problemId) return setError('Please select a problem.')
    if (!amt || amt < 10) return setError('Minimum donation is Rs. 10.')

    donate({ donorName, amount: amt, problemId, message })
    setSuccess(true)
  }

  const selectedProblem = problems.find((p) => p.id === problemId)

  const presets = [100, 500, 1000, 5000]

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="donate-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="dm-header">
          <div className="dm-header-left">
            <div className="dm-icon">💚</div>
            <div>
              <h2 className="dm-title">Donate to FixLedger</h2>
              <p className="dm-sub">Every rupee goes directly into escrow — fully transparent</p>
            </div>
          </div>
          <button className="dm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {success ? (
          <div className="dm-success animate-fade-in">
            <div className="dm-success-icon animate-success">🎉</div>
            <h3 className="dm-success-title">Donation Successful!</h3>
            <p className="dm-success-sub">
              <strong>Rs. {Number(amount).toLocaleString()}</strong> has been added to the escrow pool for:
            </p>
            <div className="dm-success-problem">{selectedProblem?.title}</div>
            <div className="dm-success-meta">
              <span className="dm-success-donor">From: {donorName}</span>
              <span className="dm-success-status">🔒 Status: ESCROW</span>
            </div>
            {message && <p className="dm-success-msg">"{message}"</p>}
            <div className="dm-success-actions">
              <button className="btn btn-primary" onClick={onClose}>Done</button>
              <button className="btn btn-ghost" onClick={() => { setSuccess(false); setAmount(''); setMessage('') }}>
                Donate Again
              </button>
            </div>
          </div>
        ) : (
          <form className="dm-form" onSubmit={handleSubmit}>

            {/* Problem selector */}
            <div className="dm-field">
              <label className="dm-label" htmlFor="donate-problem">Select Problem *</label>
              <select
                id="donate-problem"
                className="dm-select"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
              >
                <option value="">— Choose a problem —</option>
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title.slice(0, 50)}{p.title.length > 50 ? '…' : ''} ({p.displayStatus})
                  </option>
                ))}
              </select>
              {selectedProblem && (
                <div className="dm-problem-preview">
                  <img src={selectedProblem.beforeImage} alt="" className="dm-problem-img" />
                  <div>
                    <p className="dm-problem-name">{selectedProblem.title}</p>
                    <p className="dm-problem-location">📍 {selectedProblem.location}</p>
                    <p className="dm-problem-funds">
                      🔒 Current Escrow: <strong>Rs. {(selectedProblem.funded || 0).toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Preset amounts */}
            <div className="dm-field">
              <label className="dm-label">Amount (Rs.) *</label>
              <div className="dm-presets">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`dm-preset-btn ${Number(amount) === p ? 'active' : ''}`}
                    onClick={() => setAmount(String(p))}
                  >
                    Rs. {p.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                className="dm-input"
                placeholder="Or enter custom amount..."
                value={amount}
                min="10"
                onChange={(e) => setAmount(e.target.value)}
                id="donate-amount"
              />
            </div>

            {/* Message */}
            <div className="dm-field">
              <label className="dm-label" htmlFor="donate-message">Message (optional)</label>
              <textarea
                id="donate-message"
                className="dm-textarea"
                placeholder="Leave a message for the community..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                maxLength={200}
              />
            </div>

            {/* Donor info */}
            <div className="dm-donor-row">
              <div className="dm-donor-avatar">{donorName[0]}</div>
              <div>
                <p className="dm-donor-label">Donating as</p>
                <p className="dm-donor-name">{donorName}</p>
              </div>
              <div className="dm-escrow-badge">🔒 Goes to Escrow</div>
            </div>

            {error && <div className="dm-error">{error}</div>}

            {/* Summary */}
            {amount && Number(amount) > 0 && (
              <div className="dm-summary animate-fade-in">
                <div className="dm-sum-row">
                  <span>Donation Amount</span>
                  <span className="dm-sum-val accent">Rs. {Number(amount).toLocaleString()}</span>
                </div>
                <div className="dm-sum-row">
                  <span>Status</span>
                  <span className="dm-sum-val amber">🔒 ESCROW (until work verified)</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg donate-submit-btn"
              id="btn-donate-now"
              disabled={!problemId || !amount}
            >
              💚 Donate Now
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
