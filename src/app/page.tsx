import type { Metadata } from "next";
import Link from "next/link";

import {
  labProducts,
  labProductStatusLabels,
  labProductVisualStatus,
} from "@/lib/lab-products";

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

          <Link href="/how-it-works" className="lab-primary-link">
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
            appears in the original language and how much appears in English.
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
          <h3>Advance into the language</h3>
          <p>
            As your familiarity with the vocabulary and text grows, increase
            the difficulty. More of the original language remains visible and
            less English is needed.
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
          {labProducts
            .filter((product) => product.showOnHome)
            .map((product) => {
              const visualStatus = labProductVisualStatus(product.status);

              const content = (
                <>
                  <span className="lab-product-code">
                    {product.emblem ? (
                      <img
                        src={product.emblem}
                        alt=""
                        className="lab-product-symbol"
                      />
                    ) : (
                      product.code
                    )}
                  </span>

                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.corpus}</p>

                    <span
                      className={`lab-product-state ${
                        product.status === "available" ? "" : "muted"
                      }`}
                    >
                      {labProductStatusLabels[product.status]}
                    </span>
                  </div>
                </>
              );

              if (product.url && product.status === "available") {
                return (
                  <a
                    key={product.id}
                    href={product.url}
                    className="lab-product-card featured"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={product.id}
                  className={`lab-product-card ${visualStatus}`}
                >
                  {content}
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
}
