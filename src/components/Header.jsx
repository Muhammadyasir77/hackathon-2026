import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Header.css'

const ROLE_ICON = { volunteer: '🙋', organization: '🏢' }

export default function Header({ onOpenSetup }) {
  const { user } = useApp()

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: 'FixLedger', url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!')
      })
    }
  }

  return (
    <header className="header">
      <div className="header-inner container">
        {/* Brand */}
        <Link to="/" className="header-brand">
          <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {/* Ledger lines */}
              <rect x="4" y="5" width="16" height="2" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="4" y="9" width="10" height="2" rx="1" fill="currentColor" opacity="0.5"/>
              {/* Checkmark */}
              <path d="M4 16l4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-name">FixLedger</span>
          <span className="brand-tag">BETA</span>
        </Link>

        {/* Nav */}
        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            🏠 Home
          </NavLink>
          <NavLink to="/ledger" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            📊 Ledger
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm share-btn" onClick={handleShare} aria-label="Share this page">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>

          {/* Identity pill — shows user name or Guest, click to edit */}
          <button
            className={`identity-pill ${user ? 'identity-set' : ''}`}
            onClick={onOpenSetup}
            title={user ? `Edit identity: ${user.name}` : 'Set your identity'}
            aria-label="User identity"
          >
            <div className="identity-avatar">
              {user ? user.name[0].toUpperCase() : 'G'}
            </div>
            {user ? (
              <div className="identity-info">
                <span className="identity-name">{user.name}</span>
                <span className="identity-role">
                  {ROLE_ICON[user.role]} {user.role === 'organization' ? 'Org' : 'Volunteer'}
                </span>
              </div>
            ) : (
              <span className="identity-guest">Guest ✏️</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
