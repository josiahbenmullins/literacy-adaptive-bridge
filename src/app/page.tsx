import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Literacy Adaptive Bridge",
};

export default function LABHomePage() {
  return (
    <main className="app-shell lab-home">

      <section className="lab-hero">
        <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>

        <h1>
          Read the original language
          <br />
          at your level.
        </h1>

        <p>
          LAB is an adaptive reading platform designed to bridge the gap
          between learning a language and actually reading it.
        </p>

        <div className="lab-hero-actions">
          <Link href="/products" className="lab-primary-link">
            Explore Products
          </Link>

          <Link href="/how-it-works" className="lab-secondary-link">
            How LAB Works
          </Link>
        </div>
      </section>

      <section className="lab-principle">
        <div className="eyebrow">THE IDEA</div>

        <h2>The text stays. The help adapts.</h2>

        <p>
          LAB preserves the structure of the original-language text while
          providing native-language lexical support only where the reader
          needs it.
        </p>

        <p>
          As your vocabulary grows, that support recedes. Instead of moving
          between an original text and a translation, you progressively read
          more of the original text itself.
        </p>
      </section>

      <section className="lab-feature-grid">
        <article className="lab-feature-card">
          <div className="eyebrow">01 · ORIGINAL TEXT</div>
          <h3>Preserve the language</h3>
          <p>
            Word order and the underlying target-language text remain stable.
            The reader adapts without replacing the text with a conventional
            translation.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">02 · ADAPTIVE SUPPORT</div>
          <h3>Help where you need it</h3>
          <p>
            Vocabulary frequency and your own selections determine which
            words receive native-language support.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">03 · GROWTH</div>
          <h3>Read more over time</h3>
          <p>
            As words become familiar, the bridge disappears and more of the
            original language remains visible.
          </p>
        </article>
      </section>

      <section className="lab-products-preview">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow">LAB PRODUCTS</div>
            <h2>One method. Multiple texts.</h2>
          </div>

          <Link href="/products" className="lab-text-link">
            View all products →
          </Link>
        </div>

        <div className="lab-product-grid">
          <Link href="https://gnt.literacyadaptivebridge.com" className="lab-product-card featured">
            <span className="lab-product-code">GNT</span>

            <div>
              <h3>GNT LAB</h3>
              <p>Greek New Testament</p>
              <span className="lab-product-state">Available</span>
            </div>
          </Link>

          <div className="lab-product-card">
            <span className="lab-product-code">LXX</span>

            <div>
              <h3>LXX LAB</h3>
              <p>Septuagint</p>
              <span className="lab-product-state muted">Planned</span>
            </div>
          </div>

          <div className="lab-product-card">
            <span className="lab-product-code">ΙΛ</span>

            <div>
              <h3>Iliad LAB</h3>
              <p>Homer's Iliad</p>
              <span className="lab-product-state muted">Planned</span>
            </div>
          </div>

          <div className="lab-product-card">
            <span className="lab-product-code">ΟΔ</span>

            <div>
              <h3>Odyssey LAB</h3>
              <p>Homer's Odyssey</p>
              <span className="lab-product-state muted">Planned</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
