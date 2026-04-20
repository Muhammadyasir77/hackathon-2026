import { Link, NavLink, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const location = useLocation()

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: 'CivicTrust', url })
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
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="brand-name">CivicTrust</span>
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
          <button className="btn btn-ghost btn-sm share-btn" onClick={handleShare}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
          <div className="guest-pill">
            <div className="guest-avatar">G</div>
            <span>Guest</span>
          </div>
        </div>
      </div>
    </header>
  )
}
