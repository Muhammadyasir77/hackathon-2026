import './StateMachineBar.css'

const STEPS = [
  { key: 'OPEN', label: 'Open', icon: '📋', desc: 'Problem posted' },
  { key: 'LOCKED', label: 'Locked', icon: '🔒', desc: 'Task reserved' },
  { key: 'VERIFYING', label: 'Verifying', icon: '🤖', desc: 'AI checking proof' },
  { key: 'COMPLETED', label: 'Completed', icon: '✅', desc: 'Funds released' },
]

const ORDER = ['OPEN', 'LOCKED', 'VERIFYING', 'COMPLETED']

export default function StateMachineBar({ status }) {
  const currentIdx = ORDER.indexOf(status)

  return (
    <div className="state-machine-bar">
      <div className="smb-label">Task Status</div>
      <div className="smb-steps">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx
          const isActive = idx === currentIdx
          return (
            <div key={step.key} className="smb-step-wrap">
              <div className={`smb-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                <div className={`smb-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span className="smb-dot-icon">{step.icon}</span>
                  )}
                </div>
                <div className="smb-info">
                  <span className="smb-step-label">{step.label}</span>
                  <span className="smb-step-desc">{step.desc}</span>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`smb-connector ${idx < currentIdx ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
