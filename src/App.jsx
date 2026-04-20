import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import LedgerPage from './pages/LedgerPage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problem/:id" element={<DetailPage />} />
          <Route path="/ledger" element={<LedgerPage />} />
        </Routes>
      </main>
    </div>
  )
}
