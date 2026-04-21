import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import './PostProblemModal.css'

const CATEGORIES = ['Environment', 'Infrastructure', 'Safety & Lighting', 'Sanitation', 'Other']

const generateId = () => `user-${Date.now()}`

export default function PostProblemModal({ onClose, onPosted }) {
  const { user, addProblem } = useApp()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Environment',
    location: '',
    requiredFund: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef()

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  // ── Convert uploaded file to base64 so it survives localStorage / refresh ──
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setErrors((err) => ({ ...err, image: '' }))
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageFile(file)
      setImagePreview(reader.result)   // base64 data URL — persists across sessions
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    const fundNum = Number(form.requiredFund)
    if (!form.requiredFund || isNaN(fundNum) || fundNum <= 0)
      errs.requiredFund = 'Enter a valid fund amount (e.g. 2500)'
    if (!imagePreview) errs.image = 'Before image is required'
    return errs
  }

  // Build ledger data from the user-entered fund amount
  const buildFundData = (funded, poster) => {
    const half = Math.round(funded * 0.5)
    const donorA = `Donor_${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`
    const donorB = `Donor_${String.fromCharCode(75 + Math.floor(Math.random() * 10))}`
    const amtA = Math.round(funded * 0.6)
    const amtB = funded - amtA
    const volunteerName = poster || 'Volunteer'
    const ts = new Date().toLocaleString('en-PK', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })

    return {
      donations: [
        { donor: donorA, amount: amtA, status: 'ESCROW', time: 'Just now' },
        { donor: donorB, amount: amtB, status: 'ESCROW', time: 'Just now' },
      ],
      ledgerEntries: [
        { id: 'l1', from: donorA,   to: 'Escrow Pool',             amount: amtA,          type: 'DEPOSIT',  status: 'ESCROW',    time: ts },
        { id: 'l2', from: donorB,   to: 'Escrow Pool',             amount: amtB,          type: 'DEPOSIT',  status: 'ESCROW',    time: ts },
        { id: 'l3', from: 'Escrow Pool', to: `${volunteerName} (Volunteer)`, amount: half, type: 'RESERVE',  status: 'RESERVED', time: 'Task taken' },
        { id: 'l4', from: 'Escrow Pool', to: `${volunteerName} (Volunteer)`, amount: half, type: 'RELEASE',  status: 'PENDING',  time: 'After verification' },
        { id: 'l5', from: 'Escrow Pool', to: 'Remaining Pool',     amount: funded - half, type: 'BALANCE',  status: 'POOL',     time: 'Ongoing' },
      ],
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)

    setTimeout(() => {
      const volunteerName = user?.name || 'TBD'
      const funded = Math.round(Number(form.requiredFund))
      const { donations, ledgerEntries } = buildFundData(funded, volunteerName)

      const newProblem = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        story: `A community member reported: "${form.description.trim()}"`,
        location: form.location.trim(),
        category: form.category,
        beforeImage: imagePreview,
        afterImagePlaceholder: 'https://picsum.photos/seed/after-clean/700/420',
        funded,                        // ← user-entered value
        totalGoal: funded,
        joinedCount: 0,
        displayStatus: 'Active',
        task: `Resolve the reported issue: ${form.title.trim()}`,
        volunteer: {
          name: volunteerName,
          role: user?.role === 'organization' ? 'Organization' : 'Volunteer',
          rating: 0,
          completedTasks: 0,
        },
        donations,
        ledgerEntries,
        postedBy: volunteerName,
        postedAt: new Date().toISOString(),
      }

      addProblem(newProblem)
      setSubmitting(false)
      onPosted(newProblem)
      onClose()
    }, 800)
  }


  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ppm-modal animate-fade-up" role="dialog" aria-modal="true" aria-label="Post a new problem">

        {/* Header */}
        <div className="ppm-header">
          <div className="ppm-header-left">
            <span className="ppm-header-icon">📍</span>
            <div>
              <h2 className="ppm-title">Post a Problem</h2>
              <p className="ppm-sub">Report a real civic issue in your community</p>
            </div>
          </div>
          <button className="ppm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="ppm-form">

          {/* Title */}
          <div className="ppm-field">
            <label className="ppm-label" htmlFor="ppm-title">Problem Title *</label>
            <input
              id="ppm-title"
              className={`ppm-input ${errors.title ? 'has-error' : ''}`}
              type="text"
              placeholder="e.g. Broken Road near School on Main St."
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={80}
              autoFocus
            />
            {errors.title && <p className="ppm-error">{errors.title}</p>}
            <p className="ppm-char-count">{form.title.length}/80</p>
          </div>

          {/* Description */}
          <div className="ppm-field">
            <label className="ppm-label" htmlFor="ppm-desc">Description *</label>
            <textarea
              id="ppm-desc"
              className={`ppm-textarea ${errors.description ? 'has-error' : ''}`}
              placeholder="Describe the problem in detail. How long has it been there? Who is affected?"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              maxLength={300}
            />
            {errors.description && <p className="ppm-error">{errors.description}</p>}
          </div>

          {/* Category + Location row */}
          <div className="ppm-row">
            <div className="ppm-field">
              <label className="ppm-label" htmlFor="ppm-cat">Category</label>
              <select
                id="ppm-cat"
                className="ppm-select"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="ppm-field">
              <label className="ppm-label" htmlFor="ppm-loc">Location *</label>
              <input
                id="ppm-loc"
                className={`ppm-input ${errors.location ? 'has-error' : ''}`}
                type="text"
                placeholder="Street name, area, city"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              />
              {errors.location && <p className="ppm-error">{errors.location}</p>}
            </div>
          </div>

          {/* Required Fund */}
          <div className="ppm-field">
            <label className="ppm-label" htmlFor="ppm-fund">
              💰 Required Fund (Rs.) *
            </label>
            <div className="ppm-fund-wrap">
              <span className="ppm-fund-prefix">Rs.</span>
              <input
                id="ppm-fund"
                className={`ppm-input ppm-fund-input ${errors.requiredFund ? 'has-error' : ''}`}
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 5000"
                value={form.requiredFund}
                onChange={(e) => set('requiredFund', e.target.value)}
              />
            </div>
            {errors.requiredFund && <p className="ppm-error">{errors.requiredFund}</p>}
            {form.requiredFund && Number(form.requiredFund) > 0 && (
              <p className="ppm-fund-hint">
                Escrow: Rs. {Math.round(Number(form.requiredFund) * 0.5).toLocaleString()} volunteer payout
                &nbsp;+&nbsp;
                Rs. {Math.round(Number(form.requiredFund) * 0.5).toLocaleString()} remaining pool
              </p>
            )}
          </div>

          {/* Before Image */}
          <div className="ppm-field">
            <label className="ppm-label">Before Image (Photo of Problem) *</label>
            {imagePreview ? (
              <div className="ppm-image-preview">
                <img src={imagePreview} alt="Before" className="ppm-preview-img" />
                <button
                  type="button"
                  className="ppm-remove-img"
                  onClick={() => { setImagePreview(null); setImageFile(null) }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div
                className={`ppm-upload-zone ${errors.image ? 'has-error' : ''}`}
                onClick={() => fileRef.current.click()}
              >
                <span className="ppm-upload-icon">📷</span>
                <p className="ppm-upload-text">Click to upload a photo of the problem</p>
                <p className="ppm-upload-hint">JPG, PNG, WEBP accepted</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImage}
              id="ppm-image-input"
            />
            {errors.image && <p className="ppm-error">{errors.image}</p>}
          </div>

          {/* Posted by */}
          {user && (
            <div className="ppm-poster-row">
              <div className="ppm-poster-avatar">{user.name[0].toUpperCase()}</div>
              <span className="ppm-poster-name">Posting as <strong>{user.name}</strong></span>
              <span className="ppm-poster-role">{user.role === 'organization' ? '🏢 Organization' : '🙋 Volunteer'}</span>
            </div>
          )}

          {/* Submit */}
          <div className="ppm-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary btn-lg ${submitting ? 'btn-disabled' : ''}`} disabled={submitting}>
              {submitting ? (
                <><div className="spinner" style={{ width: 16, height: 16 }} /> Posting...</>
              ) : (
                '📍 Post Problem'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
