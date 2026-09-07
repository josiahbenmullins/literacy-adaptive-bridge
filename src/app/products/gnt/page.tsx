import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GNT LAB",
};

export default function GNTProductPage() {
  return (
    <main className="app-shell lab-product-detail">
      <section className="lab-product-hero">
        <div className="lab-product-hero-mark">
          <img src="/gnt-lab-symbol.png" alt="" />
        </div>

        <div>
          <div className="eyebrow">
            LITERACY ADAPTIVE BRIDGE · PRODUCT
          </div>

          <h1>GNT LAB</h1>

          <p className="lab-product-subtitle">
            An adaptive Greek New Testament reader designed to help
            you move from dependence on translation toward direct
            reading of the Greek text.
          </p>

          <div className="lab-hero-actions">
            <a
              href="https://gnt.literacyadaptivebridge.com"
              className="lab-primary-link"
            >
              Open GNT LAB
            </a>

            <a
              href="/account"
              className="lab-secondary-link"
            >
              LAB Account
            </a>
          </div>
        </div>
      </section>

      <section className="lab-principle">
        <div className="eyebrow">HOW GNT LAB WORKS</div>

        <h2>The Greek stays. The help adapts.</h2>

        <p>
          GNT LAB preserves the Greek text and its word order while
          providing English lexical support at the positions where
          you need help.
        </p>

        <p>
          Vocabulary frequency controls how much Greek you see.
          Individual words can be changed manually, allowing the
          reader to adapt as your vocabulary grows.
        </p>
      </section>

      <section className="lab-feature-grid">
        <article className="lab-feature-card">
          <div className="eyebrow">ADAPTIVE READING</div>
          <h3>Read at your level</h3>
          <p>
            Adjust the vocabulary threshold and immediately change
            how much of the New Testament appears in Greek.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">LEXICAL SUPPORT</div>
          <h3>Help in place</h3>
          <p>
            Unfamiliar words receive English support without replacing
            the underlying structure of the Greek sentence.
          </p>
        </article>

        <article className="lab-feature-card">
          <div className="eyebrow">WORD STUDY</div>
          <h3>Go deeper when needed</h3>
          <p>
            Explore individual words, vocabulary information, and
            lexical details directly from the reading experience.
          </p>
        </article>
      </section>

      <section className="gnt-product-access-summary">
        <div>
          <div className="eyebrow">GNT LAB BASIC</div>
          <h2>Try the complete method for free.</h2>
          <p>
            John 1–3, Acts 1–3, and Romans 1–3 are included with all
            reader features enabled.
          </p>
        </div>

        <div>
          <div className="eyebrow">GNT ACCESS</div>
          <h2>Unlock the entire New Testament.</h2>
          <p>
            GNT LAB Access unlocks the complete Greek New Testament
            while keeping the same adaptive reading experience.
          </p>
        </div>
      </section>
    </main>
  );
}
