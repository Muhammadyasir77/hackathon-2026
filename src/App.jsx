import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import LedgerPage from './pages/LedgerPage'
import UserSetupModal from './components/UserSetupModal'
import './App.css'

// Inner component so it can access the context
function AppInner() {
  const { user } = useApp()
  // Auto-open setup modal on first visit (no user set)
  const [showSetup, setShowSetup] = useState(true)

  return (
    <div className="app">
      <Header onOpenSetup={() => setShowSetup(true)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problem/:id" element={<DetailPage />} />
          <Route path="/ledger" element={<LedgerPage />} />
        </Routes>
      </main>

      {/* User Setup Modal — shows on first load, or when triggered from header */}
      {showSetup && !user && (
        <UserSetupModal onClose={() => setShowSetup(false)} />
      )}
      {showSetup && user && (
        // Re-edit identity when already set
        <UserSetupModal onClose={() => setShowSetup(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
