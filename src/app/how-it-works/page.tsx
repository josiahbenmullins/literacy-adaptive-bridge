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
          Start reading now, then adapt the reader as your ability grows.
        </p>
      </section>

      <div className="lab-method-stack">
        <section className="lab-method-card">
          <span>01</span>

          <div>
            <div className="eyebrow">SET YOUR LEVEL</div>
            <h2>Choose where you begin</h2>

            <p>
              Use the reading-level slider to choose how much of the text
              appears in the target language and how much receives
              native-language support.
            </p>

            <p>
              LAB uses word frequency to make that decision across the text.
              More common vocabulary can remain in the language you are
              learning, while less-familiar words receive help.
            </p>
          </div>
        </section>

        <section className="lab-method-card">
          <span>02</span>

          <div>
            <div className="eyebrow">READ &amp; ADAPT</div>
            <h2>Make the reader yours</h2>

            <p>
              Start reading immediately. Tap a word to temporarily switch it
              between the target language and your native language without
              leaving the passage.
            </p>

            <p>
              When the general reading level does not match what you actually
              know, save an individual word preference. Words you know can stay
              in the target language, while words you still need can continue
              receiving support.
            </p>
          </div>
        </section>

        <section className="lab-method-card">
          <span>03</span>

          <div>
            <div className="eyebrow">BRIDGE THE GAP</div>
            <h2>Advance into the language</h2>

            <p>
              As your familiarity with the vocabulary, syntax, and text grows,
              increase the reading level and keep more of the original language
              visible.
            </p>

            <p>
              The bridge is there to help you move forward. As your literacy
              develops, you rely on less support and read more of the text
              directly.
            </p>
          </div>
        </section>
      </div>

      <section className="lab-tools-section">
        <div className="eyebrow">TOOLS BEHIND THE BRIDGE</div>
        <h2>Simple tools that keep you reading.</h2>

        <div className="lab-tools-grid">
          <article className="lab-tool-card">
            <h3>Reading-level slider</h3>
            <p>
              Adjust the overall difficulty of the text using vocabulary
              frequency.
            </p>
          </article>

          <article className="lab-tool-card">
            <h3>Word toggle</h3>
            <p>
              Tap a word for an immediate temporary switch between the target
              and native language.
            </p>
          </article>

          <article className="lab-tool-card">
            <h3>Saved word choices</h3>
            <p>
              Override the general reading level for individual words based on
              what you actually know.
            </p>
          </article>

          <article className="lab-tool-card">
            <h3>Vocabulary page</h3>
            <p>
              Browse vocabulary, frequency, glosses, and your saved selections
              outside the reading passage.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
