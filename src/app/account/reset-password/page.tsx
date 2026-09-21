'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(), [])

  const [checkingLink, setCheckingLink] = useState(true)
  const [canReset, setCanReset] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    function acceptRecoverySession() {
      if (!active) return

      setCanReset(true)
      setCheckingLink(false)
      setError('')
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        acceptRecoverySession()
      }
    })

    async function initializeRecoverySession() {
      let session: Session | null = null
      let recoveryError: Error | null = null

      const searchParameters = new URLSearchParams(
        window.location.search
      )
      const tokenHash = searchParameters.get('token_hash')

      if (tokenHash) {
        const {
          data,
          error: verificationError,
        } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        })

        session = data.session
        recoveryError = verificationError
      }

      const hashParameters = new URLSearchParams(
        window.location.hash.replace(/^#/, '')
      )

      const accessToken = hashParameters.get('access_token')
      const refreshToken = hashParameters.get('refresh_token')

      if (
        !session &&
        !recoveryError &&
        accessToken &&
        refreshToken
      ) {
        const {
          data,
          error: sessionError,
        } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        session = data.session
        recoveryError = sessionError
      }

      if (!session && !recoveryError) {
        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession()

        session = data.session
        recoveryError = sessionError
      }

      const authorizationCode = searchParameters.get('code')

      if (!session && !recoveryError && authorizationCode) {
        const {
          data,
          error: exchangeError,
        } = await supabase.auth.exchangeCodeForSession(
          authorizationCode
        )

        session = data.session
        recoveryError = exchangeError
      }

      if (!active) return

      if (session && !recoveryError) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
        acceptRecoverySession()
        return
      }

      setCanReset(false)
      setCheckingLink(false)
      setError(
        'This password-reset link is invalid or has expired. Request a new link from the LAB account page.'
      )
    }

    void initializeRecoverySession()

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleUpdatePassword(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setSaving(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    await supabase.auth.signOut({ scope: 'global' })

    setNewPassword('')
    setConfirmPassword('')
    setCanReset(false)
    setMessage(
      'Your password has been updated. You can now sign in with the new password.'
    )
    setSaving(false)
  }

  return (
    <main className="app-shell account-page account-reset-page">
      <section className="page-heading account-page-heading">
        <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>
        <h1>Reset Password</h1>
        <p>Choose a new password for your LAB account.</p>
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

      <section className="account-card account-auth-card">
        {checkingLink ? (
          <div className="account-auth-heading">
            <div className="eyebrow">ACCOUNT SECURITY</div>
            <h2>Checking your reset link…</h2>
          </div>
        ) : canReset ? (
          <>
            <div className="account-auth-heading">
              <div className="eyebrow">ACCOUNT SECURITY</div>
              <h2>Set a new password</h2>
              <p>Your new password must contain at least 8 characters.</p>
            </div>

            <form
              onSubmit={handleUpdatePassword}
              className="account-form"
            >
              <label className="account-field">
                <span>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  required
                />
              </label>

              <label className="account-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </label>

              <div className="account-form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="account-primary-button"
                >
                  {saving ? 'Updating Password…' : 'Update Password'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="account-auth-heading">
            <div className="eyebrow">ACCOUNT SECURITY</div>
            <h2>Request another reset link</h2>
            <p>
              Return to the LAB account page, enter your email address,
              and choose Forgot Password.
            </p>
          </div>
        )}

        {!canReset && !checkingLink && (
          <a
            href="/account/"
            className="account-secondary-button account-inline-link"
          >
            Return to LAB Account
          </a>
        )}
      </section>
    </main>
  )
}
