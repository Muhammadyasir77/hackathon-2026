import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './UserSetupModal.css'

const ROLES = [
  { value: 'volunteer', label: '🙋 Volunteer', desc: 'I want to take tasks and complete work' },
  { value: 'organization', label: '🏢 Organization', desc: 'We represent a community group or NGO' },
]

export default function UserSetupModal({ onClose }) {
  const { setUser } = useApp()
  const [name, setName] = useState('')
  const [role, setRole] = useState('volunteer')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    setUser({ name: name.trim(), role })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="usm-modal animate-fade-up" role="dialog" aria-modal="true" aria-label="Set up your identity">

        {/* Header */}
        <div className="usm-header">
          <div className="usm-icon">👤</div>
          <div>
            <h2 className="usm-title">Who are you?</h2>
            <p className="usm-sub">Set a quick identity to join causes and take tasks</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="usm-form">
          {/* Name */}
          <div className="usm-field">
            <label className="usm-label" htmlFor="usm-name">Your Name</label>
            <input
              id="usm-name"
              type="text"
              className={`usm-input ${error ? 'has-error' : ''}`}
              placeholder="e.g. Ali, Sara, Community Group..."
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              autoFocus
              maxLength={40}
            />
            {error && <p className="usm-error">{error}</p>}
          </div>

          {/* Role */}
          <div className="usm-field">
            <label className="usm-label">Your Role</label>
            <div className="usm-roles">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`usm-role-card ${role === r.value ? 'selected' : ''}`}
                  onClick={() => setRole(r.value)}
                >
                  <span className="usm-role-label">{r.label}</span>
                  <span className="usm-role-desc">{r.desc}</span>
                  {role === r.value && <span className="usm-role-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="usm-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Continue as Guest
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              Save Identity →
            </button>
          </div>
        </form>

        <p className="usm-note">
          🔒 No account required. This is stored locally in your session only.
        </p>
      </div>
    </div>
  )
}
