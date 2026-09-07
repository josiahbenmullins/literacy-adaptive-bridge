import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How LAB Works",
};

export default function HowItWorksPage() {
  return (
    <main className="app-shell">
      <section className="page-heading">
        <div className="eyebrow">THE LAB METHOD</div>
        <h1>How it works</h1>
        <p>
          LAB is designed to make authentic texts readable before every word
          in the language has been mastered.
        </p>
      </section>

      <div className="lab-method-stack">
        <section className="lab-method-card">
          <span>01</span>
          <div>
            <h2>Begin with the original text</h2>
            <p>
              The target-language text is the foundation. Its sequence and
              structure remain intact rather than being replaced by a
              translated sentence.
            </p>
          </div>
        </section>

        <section className="lab-method-card">
          <span>02</span>
          <div>
            <h2>Measure what the reader is likely to know</h2>
            <p>
              Vocabulary frequency provides a practical way to estimate which
              words are familiar and which words still need support.
            </p>
          </div>
        </section>

        <section className="lab-method-card">
          <span>03</span>
          <div>
            <h2>Bridge unfamiliar words in place</h2>
            <p>
              Native-language lexical support appears at the position of an
              unfamiliar word while the structure of the original sentence
              remains visible.
            </p>
          </div>
        </section>

        <section className="lab-method-card">
          <span>04</span>
          <div>
            <h2>Let the bridge disappear</h2>
            <p>
              Readers can change their level and mark individual vocabulary
              as known. As familiarity grows, more of the original text is
              displayed directly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
