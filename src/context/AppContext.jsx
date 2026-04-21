import { createContext, useContext, useState, useEffect } from 'react'
import { problems as seedProblems } from '../data/problems'

const AppContext = createContext(null)

const LS_PROBLEMS  = 'fixledger_problems'
const LS_USER      = 'fixledger_user'
const LS_DONATIONS = 'fixledger_donations'

// ── Helpers ──────────────────────────────────────────────
const loadProblems = () => {
  try {
    const raw = localStorage.getItem(LS_PROBLEMS)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted — fall through */ }
  return seedProblems
}

const loadUser = () => {
  try {
    const raw = localStorage.getItem(LS_USER)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted */ }
  return null
}

const loadDonations = () => {
  try {
    const raw = localStorage.getItem(LS_DONATIONS)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted */ }
  return []
}

const ts = () =>
  new Date().toLocaleString('en-PK', {
    hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
  })

// ─────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // ── User identity ──
  const [user, setUserState] = useState(() => loadUser())

  const setUser = (u) => {
    setUserState(u)
    if (u) localStorage.setItem(LS_USER, JSON.stringify(u))
    else    localStorage.removeItem(LS_USER)
  }

  // ── Donations list — persisted ──
  const [donations, setDonations] = useState(() => loadDonations())

  useEffect(() => {
    try { localStorage.setItem(LS_DONATIONS, JSON.stringify(donations)) }
    catch (e) { console.warn('localStorage quota', e) }
  }, [donations])

  // ── Problems list — persisted ──
  const [problems, setProblems] = useState(() => loadProblems())

  useEffect(() => {
    try {
      localStorage.setItem(LS_PROBLEMS, JSON.stringify(problems))
    } catch (e) {
      console.warn('localStorage quota exceeded', e)
    }
  }, [problems])

  // ── Generic helpers ──────────────────────────────────────
  const addProblem = (newProblem) =>
    setProblems((prev) => [newProblem, ...prev])

  const updateProblem = (id, patch) =>
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    )

  // ── Action: Join a problem (persist +1) ──────────────────
  const joinProblem = (id) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, joinedCount: (p.joinedCount || 0) + 1 }
          : p
      )
    )
  }

  // ── Action: Volunteer takes the task ─────────────────────
  // Locks entire fund as reservedFund; adds volunteer record; adds RESERVE ledger entry
  const takeTask = (id, volunteerName) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        // Prevent duplicate assignment
        const already = (p.volunteers || []).some((v) => v.name === volunteerName)
        if (already) return p

        const assignedFund = p.funded || 0
        const volunteerRecord = {
          id: `vol-${Date.now()}`,
          name: volunteerName,
          status: 'assigned',
          assignedFund,
          releasedFund: 0,
          remainingFund: assignedFund,
        }

        const reserveEntry = {
          id: `le-res-${Date.now()}`,
          from: 'Escrow Pool',
          to: `${volunteerName} (Volunteer)`,
          amount: assignedFund,
          type: 'RESERVE',
          status: 'RESERVED',
          time: ts(),
        }

        return {
          ...p,
          displayStatus: 'In Progress',
          reservedFund: assignedFund,
          releasedFund: 0,
          volunteers: [...(p.volunteers || []), volunteerRecord],
          ledgerEntries: [...(p.ledgerEntries || []), reserveEntry],
        }
      })
    )
  }

  // ── Action: Release 30% on Before Image upload ───────────
  const releaseBeforeFund = (id, volunteerName) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const total = p.funded || 0
        const release30 = Math.round(total * 0.3)
        const remaining = total - release30

        const entry = {
          id: `le-pre-${Date.now()}`,
          from: 'Escrow Pool',
          to: `${volunteerName} (Volunteer)`,
          amount: release30,
          type: 'RELEASE_30',
          status: 'PAID',
          time: ts(),
        }

        const updatedVols = (p.volunteers || []).map((v) =>
          v.name === volunteerName
            ? { ...v, releasedFund: release30, remainingFund: remaining, status: 'before_paid' }
            : v
        )

        return {
          ...p,
          releasedFund: release30,
          reservedFund: remaining,
          volunteers: updatedVols,
          ledgerEntries: [...(p.ledgerEntries || []), entry],
        }
      })
    )
  }

  // ── Action: Release remaining 70% after verification ─────
  const releaseAfterFund = (id, volunteerName) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const total = p.funded || 0
        const already = Math.round(total * 0.3)
        const remaining = total - already

        const entry = {
          id: `le-post-${Date.now()}`,
          from: 'Escrow Pool',
          to: `${volunteerName} (Volunteer)`,
          amount: remaining,
          type: 'RELEASE_70',
          status: 'PAID',
          time: ts(),
        }

        const updatedVols = (p.volunteers || []).map((v) =>
          v.name === volunteerName
            ? { ...v, releasedFund: total, remainingFund: 0, status: 'completed' }
            : v
        )

        return {
          ...p,
          displayStatus: 'Completed',
          status: 'COMPLETED',
          releasedFund: total,
          reservedFund: 0,
          volunteers: updatedVols,
          ledgerEntries: [...(p.ledgerEntries || []), entry],
        }
      })
    )
  }

  // ── Action: Donate to a problem ─────────────────────────
  const donate = ({ donorName, amount, problemId, message }) => {
    const amt = Number(amount)
    if (!amt || amt <= 0 || !problemId) return

    const time = new Date().toLocaleString('en-PK', {
      hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
    })

    const donationRecord = {
      id: `don-${Date.now()}`,
      donorName,
      amount: amt,
      problemId,
      message: message || '',
      timestamp: new Date().toISOString(),
      time,
    }

    // Append to global donations history
    setDonations((prev) => [donationRecord, ...prev])

    // Update the target problem atomically
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p

        const donorEntry = {
          donor: donorName,
          amount: amt,
          status: 'ESCROW',
          time,
        }
        const ledgerEntry = {
          id: `le-don-${Date.now()}`,
          from: donorName,
          to: 'Escrow Pool',
          amount: amt,
          type: 'DONATION',
          status: 'ESCROW',
          time,
        }

        return {
          ...p,
          funded: (p.funded || 0) + amt,
          reservedFund: (p.reservedFund || p.funded || 0) + amt,
          donations: [...(p.donations || []), donorEntry],
          ledgerEntries: [...(p.ledgerEntries || []), ledgerEntry],
        }
      })
    )
  }

  // ── Derived stats ────────────────────────────────────────
  const totalProblems = problems.length
  const totalFunds = problems.reduce((sum, p) => sum + (p.funded || 0), 0)

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        problems, addProblem, updateProblem,
        joinProblem, takeTask,
        releaseBeforeFund, releaseAfterFund,
        donate, donations,
        totalProblems, totalFunds,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
