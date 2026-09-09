import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Literacy Adaptive Bridge",
};

export default function LABHomePage() {
  return (
    <main className="app-shell lab-home">

      <section className="lab-hero">
        <div className="lab-hero-lockup">
          <div className="lab-hero-emblem">
            <img
              src="/lab-symbol.png"
              alt="Literacy Adaptive Bridge emblem"
            />
          </div>

          <div className="lab-hero-title">
            <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>

            <h1 className="lab-hero-headline">
              <span>Start reading today;</span>
              <span>build literacy as you go.</span>
            </h1>
          </div>
        </div>

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
        <h2>The idea: Learn while you read.</h2>

        <p>
          The LAB philosophy is simple: get students reading today and build
          vocabulary along the way.
        </p>

        <p>
          Syntax, structure, and usage are learned from the text itself, where
          the language is actually being used.
        </p>

        <p>
          Rather than trying to learn the language before they read, LAB helps
          students learn while they read.
        </p>
      </section>

      <section className="lab-feature-grid">
        <article className="lab-feature-card">
          <div className="eyebrow">01 · SET YOUR LEVEL</div>
          <h3>Choose where you begin</h3>
          <p>
            Use the reading-level slider to choose how much of the text
            appears in the target language and how much receives
            native-language support.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">02 · READ &amp; ADAPT</div>
          <h3>Make the reader yours</h3>
          <p>
            Start reading immediately. As you encounter words, manually mark
            what you know and what still needs support so LAB adapts to your
            actual ability.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">03 · BRIDGE THE GAP</div>
          <h3>Let the help fade</h3>
          <p>
            As your familiarity with the vocabulary and text grows, increase
            the difficulty. More of the target language remains visible and
            less support is needed.
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
            <span className="lab-product-code">
              <img
                src="/gnt-lab-symbol.png"
                alt=""
                className="lab-product-symbol"
              />
            </span>

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
