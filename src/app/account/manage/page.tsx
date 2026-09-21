'use client'

import { FormEvent, useMemo, useState } from 'react'

import { useLABAccess } from '@/components/LABAccessProvider'
import { LAB_PRODUCTS } from '@/lib/lab/products'
import { createClient } from '@/lib/supabase/client'

export default function ManageAccountPage() {
  const supabase = useMemo(() => createClient(), [])

  const {
    user,
    productAccess,
    isLoading,
  } = useLABAccess()

  const [error, setError] = useState('')
  const [showDeleteAccount, setShowDeleteAccount] =
    useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] =
    useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [portalProduct, setPortalProduct] =
    useState<string | null>(null)

  async function handleManageSubscription(
    productName: string
  ) {
    setError('')
    setPortalProduct(productName)

    const { data, error: functionError } =
      await supabase.functions.invoke('create-billing-portal', {
        body: {},
      })

    if (functionError) {
      setError(
        'Unable to open subscription management. Please try again.'
      )
      setPortalProduct(null)
      return
    }

    if (!data?.url) {
      setError(
        data?.error ||
          'Stripe did not return a subscription-management link.'
      )
      setPortalProduct(null)
      return
    }

    window.location.assign(data.url)
  }

  async function handleDeleteAccount(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!user?.email) {
      setError('Unable to verify the email address for this account.')
      return
    }

    if (!deletePassword) {
      setError('Enter your current password.')
      return
    }

    if (deleteConfirmation !== 'DELETE') {
      setError('Type DELETE exactly to confirm account deletion.')
      return
    }

    setDeleteLoading(true)

    const { error: reauthenticationError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      })

    if (reauthenticationError) {
      setError('Your current password is incorrect.')
      setDeleteLoading(false)
      return
    }

    const { data, error: functionError } =
      await supabase.functions.invoke('delete-lab-account', {
        body: {
          confirmation: 'DELETE',
        },
      })

    if (functionError || !data?.success) {
      setError(
        data?.error ||
          'Unable to delete your LAB account. Please try again.'
      )
      setDeleteLoading(false)
      return
    }

    await supabase.auth.signOut({ scope: 'local' })

    try {
      window.localStorage.removeItem('gnt-reader-settings-v1')
    } catch {
      // Local cleanup is best-effort after server-side deletion.
    }

    window.location.assign('/')
  }

  return (
    <main className="app-shell account-page">
      <section className="page-heading account-page-heading">
        <div className="eyebrow">
          LITERACY ADAPTIVE BRIDGE
        </div>

        <h1>Manage Account</h1>

        <p>
          Manage subscriptions for your LAB products and control
          your shared LAB account.
        </p>

        <a
          href="/account/"
          className="account-secondary-button account-inline-link"
        >
          Return to LAB Account
        </a>
      </section>

      {error && (
        <div className="account-notice account-notice-error">
          {error}
        </div>
      )}

      {isLoading ? (
        <section className="account-card account-loading-card">
          <div className="eyebrow">ACCOUNT</div>
          <h2>Loading your LAB account…</h2>
        </section>
      ) : !user ? (
        <section className="account-card account-auth-card">
          <div className="account-auth-heading">
            <div className="eyebrow">ACCOUNT REQUIRED</div>
            <h2>Sign in to manage your account</h2>
            <p>
              Return to the LAB account page and sign in first.
            </p>
          </div>

          <a
            href="/account/"
            className="account-primary-button account-inline-link"
          >
            Go to Sign In
          </a>
        </section>
      ) : (
        <div className="account-dashboard">
          <section className="account-products">
            <div className="section-heading-row">
              <div>
                <div className="eyebrow">
                  PRODUCT SUBSCRIPTIONS
                </div>
                <h2>Your LAB products</h2>
              </div>
            </div>

            {LAB_PRODUCTS.map((product) => {
              const access = productAccess[product.slug]
              const isPlanned =
                product.state === 'planned' &&
                !access.hasAccess
              const isPortalLoading =
                portalProduct === product.name

              return (
                <article
                  key={product.slug}
                  className="account-product-card account-management-product"
                >
                  <div className="account-product-main">
                    <div className="account-product-code">
                      {product.code}
                    </div>

                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                  </div>

                  <div className="account-product-actions">
                    {access.hasAccess ? (
                      <>
                        <span className="account-status-badge pro">
                          <span aria-hidden="true">✓</span>
                          {access.source === 'executive'
                            ? 'Lifetime Pro Access'
                            : 'Pro Access Active'}
                        </span>

                        {access.source !== 'executive' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleManageSubscription(
                                product.name
                              )
                            }
                            disabled={portalProduct !== null}
                            className="account-primary-button"
                          >
                            {isPortalLoading
                              ? 'Opening Subscription…'
                              : 'Manage Subscription'}
                          </button>
                        )}
                      </>
                    ) : isPlanned ? (
                      <span className="account-status-badge">
                        Planned
                      </span>
                    ) : (
                      <>
                        <span className="account-status-badge free">
                          Free Access
                        </span>

                        {product.productUrl && (
                          <a
                            href={`${product.productUrl}/account/`}
                            className="account-secondary-button account-inline-link"
                          >
                            View Pro Options
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </section>

          <section className="account-card account-security-card">
            <div className="account-auth-heading">
              <div className="eyebrow">ACCOUNT DELETION</div>
              <h2>Delete your LAB account</h2>
              <p>
                Permanently remove your LAB account, saved reader
                settings, word preferences, and product access
                records.
              </p>
            </div>

            {!showDeleteAccount ? (
              <button
                type="button"
                onClick={() => setShowDeleteAccount(true)}
                className="account-danger-button"
              >
                Delete Account
              </button>
            ) : (
              <form
                onSubmit={handleDeleteAccount}
                className="account-form account-danger-panel"
              >
                <div className="account-danger-warning">
                  <strong>This cannot be undone.</strong>
                  <span>
                    Stripe subscriptions will be canceled. Apple
                    or Google subscriptions must be canceled
                    separately through the applicable app store.
                  </span>
                </div>

                <label className="account-field">
                  <span>Current password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={deletePassword}
                    onChange={(event) =>
                      setDeletePassword(event.target.value)
                    }
                    required
                  />
                </label>

                <label className="account-field">
                  <span>Type DELETE to confirm</span>
                  <input
                    type="text"
                    autoComplete="off"
                    value={deleteConfirmation}
                    onChange={(event) =>
                      setDeleteConfirmation(event.target.value)
                    }
                    required
                  />
                </label>

                <div className="account-form-actions">
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="account-danger-button"
                  >
                    {deleteLoading
                      ? 'Deleting Account…'
                      : 'Permanently Delete Account'}
                  </button>

                  <button
                    type="button"
                    disabled={deleteLoading}
                    onClick={() => {
                      setShowDeleteAccount(false)
                      setDeletePassword('')
                      setDeleteConfirmation('')
                    }}
                    className="account-secondary-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
