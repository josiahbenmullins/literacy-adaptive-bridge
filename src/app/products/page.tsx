import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <main className="app-shell">
      <section className="page-heading">
        <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>
        <h1>Products</h1>
        <p>
          Adaptive readers built around the same LAB method, each focused on
          a specific original-language corpus.
        </p>
      </section>

      <div className="lab-product-library">
        <Link href="/products/gnt" className="lab-product-library-card active">
          <div className="lab-product-code large">GNT</div>

          <div>
            <div className="eyebrow">AVAILABLE NOW</div>
            <h2>GNT LAB</h2>
            <p>Greek New Testament adaptive reader.</p>
            <span>Open GNT LAB →</span>
          </div>
        </Link>

        <article className="lab-product-library-card">
          <div className="lab-product-code large">LXX</div>
          <div>
            <div className="eyebrow">PLANNED</div>
            <h2>LXX LAB</h2>
            <p>Adaptive reading of the Greek Septuagint.</p>
          </div>
        </article>

        <article className="lab-product-library-card">
          <div className="lab-product-code large">ΙΛ</div>
          <div>
            <div className="eyebrow">PLANNED</div>
            <h2>Iliad LAB</h2>
            <p>Adaptive reading of Homer's Iliad.</p>
          </div>
        </article>

        <article className="lab-product-library-card">
          <div className="lab-product-code large">ΟΔ</div>
          <div>
            <div className="eyebrow">PLANNED</div>
            <h2>Odyssey LAB</h2>
            <p>Adaptive reading of Homer's Odyssey.</p>
          </div>
        </article>
      </div>
    </main>
  );
}
