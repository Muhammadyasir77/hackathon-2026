import { createContext, useContext, useState, useEffect } from 'react'
import { problems as seedProblems } from '../data/problems'

const AppContext = createContext(null)

const LS_PROBLEMS = 'civictrust_problems'
const LS_USER     = 'civictrust_user'

// ── Helpers ──────────────────────────────────────────────
const loadProblems = () => {
  try {
    const raw = localStorage.getItem(LS_PROBLEMS)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted — fall through */ }
  return seedProblems   // first visit: use seed data
}

const loadUser = () => {
  try {
    const raw = localStorage.getItem(LS_USER)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted */ }
  return null
}

// ─────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // ── User identity — persisted ──
  const [user, setUserState] = useState(() => loadUser())

  const setUser = (u) => {
    setUserState(u)
    if (u) {
      localStorage.setItem(LS_USER, JSON.stringify(u))
    } else {
      localStorage.removeItem(LS_USER)
    }
  }

  // ── Problems list — persisted ──
  const [problems, setProblems] = useState(() => loadProblems())

  // Sync problems → localStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_PROBLEMS, JSON.stringify(problems))
    } catch (e) {
      // Quota exceeded (e.g. many large base64 images) — fail silently
      console.warn('localStorage quota exceeded; problems not persisted', e)
    }
  }, [problems])

  const addProblem = (newProblem) => {
    setProblems((prev) => [newProblem, ...prev])
  }

  // Update a single problem in-place (generic patch)
  const updateProblem = (id, patch) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    )
  }

  // Mark a problem COMPLETED and append a PAYMENT ledger entry
  const completeTask = (id, volunteerName, amount) => {
    const ts = new Date().toLocaleString('en-PK', {
      hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
    })
    const paymentEntry = {
      id: `pay-${Date.now()}`,
      from: 'Escrow Pool',
      to: `${volunteerName} (Volunteer)`,
      amount,
      type: 'PAYMENT',
      status: 'PAID',
      time: ts,
    }
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              displayStatus: 'Completed',
              status: 'COMPLETED',
              ledgerEntries: [...(p.ledgerEntries || []), paymentEntry],
            }
          : p
      )
    )
  }

  // Derived stats — computed fresh every render so consumers always get live data
  const totalProblems = problems.length
  const totalFunds = problems.reduce((sum, p) => sum + (p.funded || 0), 0)

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        problems, addProblem, updateProblem, completeTask,
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

