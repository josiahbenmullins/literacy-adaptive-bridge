import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-shell">
      <section className="empty-state">
        <div className="eyebrow">NOT AVAILABLE</div>
        <h1>Page not available</h1>
        <p>
          This page could not be found or is not available in the current build.
        </p>
        <Link href="/" className="primary-link">
          Return home
        </Link>
      </section>
    </main>
  );
}
