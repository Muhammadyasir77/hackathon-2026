import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import LedgerPage from './pages/LedgerPage'
import UserSetupModal from './components/UserSetupModal'
import DonateModal from './components/DonateModal'
import './App.css'

// Inner component so it can access the context
function AppInner() {
  const { user } = useApp()
  const [showSetup, setShowSetup] = useState(true)
  const [showDonate, setShowDonate] = useState(false)

  return (
    <div className="app">
      <Header
        onOpenSetup={() => setShowSetup(true)}
        onDonate={() => setShowDonate(true)}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage onDonate={() => setShowDonate(true)} />} />
          <Route path="/problem/:id" element={<DetailPage onDonate={() => setShowDonate(true)} />} />
          <Route path="/ledger" element={<LedgerPage />} />
        </Routes>
      </main>

      {/* User Setup Modal */}
      {showSetup && (
        <UserSetupModal onClose={() => setShowSetup(false)} />
      )}

      {/* Donate Modal */}
      {showDonate && (
        <DonateModal onClose={() => setShowDonate(false)} />
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
