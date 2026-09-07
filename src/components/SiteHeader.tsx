'use client'

import Link from "next/link";

import { useLABAccess } from "@/components/LABAccessProvider";

export default function SiteHeader() {
  const { user, isLoading } = useLABAccess();

  const signedIn = !isLoading && Boolean(user);

  return (
    <header className="site-header lab-site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Literacy Adaptive Bridge home"
        >
          <span
            className="brand-mark lab-brand-mark"
            aria-hidden="true"
          >
            LAB
          </span>

          <span>
            <strong>LAB</strong>
            <small>Literacy Adaptive Bridge</small>
          </span>
        </Link>

        <nav
          className="site-nav"
          aria-label="LAB navigation"
        >
          <Link href="/products" className="nav-link">
            Products
          </Link>

          <Link
            href="/how-it-works"
            className="nav-link how-it-works-link"
          >
            How It Works
          </Link>

          <Link
            href="/settings"
            className="nav-link settings-link"
            aria-label="Settings"
            title="Settings"
          >
            <span aria-hidden="true">⚙︎</span>
          </Link>

          <Link
            href="/account"
            className="nav-link account-link"
            aria-label={
              signedIn
                ? "LAB Account — signed in"
                : "LAB Account"
            }
            title={
              signedIn
                ? "LAB Account — Signed In"
                : "LAB Account"
            }
          >
            <span className="account-icon-wrap">
              <svg
                className="account-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21c.6-4.4 3.1-7 7.5-7s6.9 2.6 7.5 7" />
              </svg>

              {signedIn && (
                <span
                  className="account-signed-in-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
