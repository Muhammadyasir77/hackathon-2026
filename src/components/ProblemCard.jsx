import { useNavigate } from 'react-router-dom'
import './ProblemCard.css'

const statusMap = {
  Active: { label: 'Active', cls: 'badge-open', dot: true },
  Completed: { label: 'Completed', cls: 'badge-completed', dot: false },
  'In Progress': { label: 'In Progress', cls: 'badge-locked', dot: true },
}

export default function ProblemCard({ problem }) {
  const navigate = useNavigate()
  const s = statusMap[problem.displayStatus] || statusMap['Active']

  return (
    <article
      className="problem-card"
      onClick={() => navigate(`/problem/${problem.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/problem/${problem.id}`)}
      aria-label={`View problem: ${problem.title}`}
    >
      {/* Image */}
      <div className="card-image-wrap">
        <img
          src={problem.beforeImage}
          alt={problem.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-overlay" />
        <span className={`badge ${s.cls} card-status-badge`}>
          {s.dot && <span className="badge-dot" />}
          {s.label}
        </span>
        <span className="card-category">{problem.category}</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <h3 className="card-title">{problem.title}</h3>
        <p className="card-desc">{problem.description}</p>

        <div className="card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {problem.location}
        </div>

        <div className="card-divider" />

        {/* Stats row */}
        <div className="card-stats">
          <div className="stat-item funded">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/>
            </svg>
            <span>Rs. {problem.funded.toLocaleString()} Funded</span>
          </div>
          <div className="stat-item joined">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <span>{problem.joinedCount} joined</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="card-footer">
        <span className="card-cta-text">View Details →</span>
      </div>
    </article>
  )
}
