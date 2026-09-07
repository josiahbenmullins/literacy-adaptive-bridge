'use client'

import { FormEvent, useMemo, useState } from 'react'

import { useLABAccess } from '@/components/LABAccessProvider'
import { createClient } from '@/lib/supabase/client'

export default function AccountPage() {
  const supabase = useMemo(() => createClient(), [])

  const {
    user,
    hasGNTAccess,
    isLoading,
    refreshAccess,
  } = useLABAccess()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function handleSignIn(event: FormEvent) {
    event.preventDefault()

    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setActionLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setActionLoading(false)
      return
    }

    setPassword('')
    await refreshAccess()
    setActionLoading(false)
  }

  async function handleCreateAccount() {
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setActionLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })

    if (error) {
      setError(error.message)
      setActionLoading(false)
      return
    }

    setPassword('')

    if (data.session) {
      await refreshAccess()
      setMessage('Your LAB account has been created.')
    } else {
      setMessage(
        'Your LAB account has been created. Check your email to confirm your address, then sign in.'
      )
    }

    setActionLoading(false)
  }

  async function handleSignOut() {
    setError('')
    setMessage('')
    setActionLoading(true)

    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
      setActionLoading(false)
      return
    }

    await refreshAccess()
    setActionLoading(false)
  }

  return (
    <main className="app-shell account-page">
      <section className="page-heading account-page-heading">
        <div className="eyebrow">
          LITERACY ADAPTIVE BRIDGE
        </div>

        <h1>LAB Account</h1>

        <p>
          One account for your LAB products, purchases,
          reading progress, vocabulary, and settings.
        </p>
      </section>

      {error && (
        <div className="account-notice account-notice-error">
          {error}
        </div>
      )}

      {message && (
        <div className="account-notice">
          {message}
        </div>
      )}

      {isLoading ? (
        <section className="account-card account-loading-card">
          <div className="eyebrow">ACCOUNT</div>
          <h2>Loading your LAB account…</h2>
        </section>
      ) : user ? (
        <div className="account-dashboard">

          <section className="account-card account-identity-card">
            <div className="account-card-heading">
              <div className="account-avatar">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21c.6-4.4 3.1-7 7.5-7s6.9 2.6 7.5 7" />
                </svg>

                <span className="account-avatar-check">
                  ✓
                </span>
              </div>

              <div>
                <div className="eyebrow">
                  ACCOUNT STATUS
                </div>
                <h2>Signed in</h2>
              </div>
            </div>

            <div className="account-email">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={actionLoading}
              className="account-secondary-button"
            >
              {actionLoading ? 'Signing Out…' : 'Sign Out'}
            </button>
          </section>

          <section className="account-products">
            <div className="section-heading-row">
              <div>
                <div className="eyebrow">
                  YOUR PRODUCTS
                </div>
                <h2>LAB Access</h2>
              </div>
            </div>

            <article className="account-product-card">
              <div className="account-product-main">
                <div className="account-product-mark">
                  <img
                    src="/gnt-lab-symbol.png"
                    alt=""
                  />
                </div>

                <div>
                  <h3>GNT LAB</h3>

                  <p>
                    Greek New Testament adaptive reader
                  </p>
                </div>
              </div>

              <div className="account-product-status">
                {hasGNTAccess ? (
                  <>
                    <span className="account-status-badge active">
                      <span aria-hidden="true">✓</span>
                      GNT Access Active
                    </span>

                    <small>
                      Complete Greek New Testament unlocked
                    </small>
                  </>
                ) : (
                  <>
                    <span className="account-status-badge">
                      Basic Access
                    </span>

                    <small>
                      John 1–3 · Acts 1–3 · Romans 1–3
                    </small>
                  </>
                )}
              </div>
            </article>
          </section>

        </div>
      ) : (
        <section className="account-card account-auth-card">
          <div className="account-auth-heading">
            <div className="eyebrow">
              LAB ACCOUNT
            </div>

            <h2>Sign in</h2>

            <p>
              Sign in to access your LAB products across
              devices and the web.
            </p>
          </div>

          <form
            onSubmit={handleSignIn}
            className="account-form"
          >
            <label className="account-field">
              <span>Email</span>

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="account-field">
              <span>Password</span>

              <input
                type="password"
                autoComplete="current-password"
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 8 characters"
                required
              />
            </label>

            <div className="account-form-actions">
              <button
                type="submit"
                disabled={actionLoading}
                className="account-primary-button"
              >
                {actionLoading ? 'Working…' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={actionLoading}
                className="account-secondary-button"
              >
                Create Account
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  )
}
