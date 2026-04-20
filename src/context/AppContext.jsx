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

  // Expose a way to update a single problem in-place (e.g. after verification)
  const updateProblem = (id, patch) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    )
  }

  return (
    <AppContext.Provider value={{ user, setUser, problems, addProblem, updateProblem }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

