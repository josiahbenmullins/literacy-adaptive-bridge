'use client'

import { FormEvent, useMemo, useState } from 'react'

import { useLABAccess } from '@/components/LABAccessProvider'
import { LAB_PRODUCTS } from '@/lib/lab/products'
import {
  createClient,
  requestPasswordReset,
} from '@/lib/supabase/client'

export default function AccountPage() {
  const supabase = useMemo(() => createClient(), [])

  const {
    user,
    productAccess,
    hasGNTAccess,
    isLoading,
    refreshAccess,
  } = useLABAccess()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [passwordResetLoading, setPasswordResetLoading] =
    useState(false)

  async function handleSignIn(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setActionLoading(true)

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) {
      setError(signInError.message)
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

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            `${window.location.origin}/account/`,
        },
      })

    if (signUpError) {
      setError(signUpError.message)
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

  async function handleForgotPassword() {
    setError('')
    setMessage('')

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setError('Enter your email address first.')
      return
    }

    setPasswordResetLoading(true)

    const { error: resetError } = await requestPasswordReset(
      normalizedEmail,
      `${window.location.origin}/account/reset-password/`
    )

    if (resetError) {
      setError(resetError.message)
      setPasswordResetLoading(false)
      return
    }

    setMessage(
      'If a LAB account exists for that email address, a password-reset link has been sent.'
    )
    setPasswordResetLoading(false)
  }

  async function handleSignOut() {
    setError('')
    setMessage('')
    setActionLoading(true)

    const { error: signOutError } =
      await supabase.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
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
          <section
            className={`account-card account-identity-card ${
              hasGNTAccess
                ? 'account-identity-pro'
                : 'account-identity-free'
            }`}
          >
            <div className="account-card-heading">
              <div className="account-avatar">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21c.6-4.4 3.1-7 7.5-7s6.9 2.6 7.5 7" />
                </svg>

                <span
                  className={`account-avatar-check ${
                    hasGNTAccess ? 'pro' : 'free'
                  }`}
                >
                  ✓
                </span>
              </div>

              <div>
                <div className="eyebrow">ACCOUNT STATUS</div>
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
                <div className="eyebrow">YOUR PRODUCTS</div>
                <h2>LAB Access</h2>
              </div>
            </div>

            {LAB_PRODUCTS.map((product) => {
              const access = productAccess[product.slug]
              const isPlanned =
                product.state === 'planned' &&
                !access.hasAccess

              return (
                <article
                  key={product.slug}
                  className={`account-product-card ${
                    access.hasAccess
                      ? 'account-product-card-pro'
                      : isPlanned
                        ? 'account-product-card-planned'
                        : 'account-product-card-free'
                  }`}
                >
                  <div className="account-product-main">
                    {product.slug === 'gnt-lab' ? (
                      <div className="account-product-mark">
                        <img
                          src="/gnt-lab-symbol.png"
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="account-product-code">
                        {product.code}
                      </div>
                    )}

                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                  </div>

                  <div className="account-product-status">
                    {access.hasAccess ? (
                      <>
                        <span className="account-status-badge pro">
                          <span aria-hidden="true">✓</span>
                          Pro Access Active
                        </span>

                        <strong className="account-access-title">
                          You have {product.name} Pro access
                        </strong>

                        <small>
                          {access.source === 'executive'
                            ? 'Lifetime access'
                            : 'Full product access'}
                        </small>
                      </>
                    ) : isPlanned ? (
                      <>
                        <span className="account-status-badge">
                          Planned
                        </span>

                        <small>
                          Subscription options will appear here
                          when {product.name} launches.
                        </small>
                      </>
                    ) : (
                      <>
                        <span className="account-status-badge free">
                          <span aria-hidden="true">✓</span>
                          Free Access
                        </span>

                        <strong className="account-access-title">
                          You have {product.name} Free access
                        </strong>

                        <small>
                          Upgrade options are available through
                          the product site.
                        </small>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </section>

          <div className="account-manage-link-row">
            <a
              href="/account/manage/"
              className="account-primary-button account-inline-link"
            >
              Manage Account
            </a>
          </div>
        </div>
      ) : (
        <section className="account-card account-auth-card">
          <div className="account-auth-heading">
            <div className="eyebrow">LAB ACCOUNT</div>

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

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={passwordResetLoading}
                className="account-secondary-button"
              >
                {passwordResetLoading
                  ? 'Sending Reset Link…'
                  : 'Forgot Password?'}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  )
}
