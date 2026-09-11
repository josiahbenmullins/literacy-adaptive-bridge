import type { Metadata } from "next";

import {
  labProducts,
  labProductGroups,
  labProductStatusLabels,
  labProductVisualStatus,
} from "@/lib/lab-products";

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

      {labProductGroups.map((group) => {
        const products = labProducts.filter(
          (product) => product.group === group
        );

        return (
          <section className="lab-product-category" key={group}>
            <div className="eyebrow">{group.toUpperCase()}</div>

            <div className="lab-product-library">
              {products.map((product) => {
                const visualStatus = labProductVisualStatus(product.status);

                const content = (
                  <>
                    <div className="lab-product-code large">
                      {product.emblem ? (
                        <img
                          src={product.emblem}
                          alt=""
                          className="lab-product-symbol"
                        />
                      ) : (
                        product.code
                      )}
                    </div>

                    <div>
                      <div className="eyebrow">
                        {product.corpus.toUpperCase()}
                      </div>

                      <h2>{product.name}</h2>

                      {product.facts && (
                        <p className="lab-product-facts">
                          {product.facts}
                        </p>
                      )}

                      <p>{product.description}</p>

                      {product.basicCopy && (
                        <p className="lab-product-basic-copy">
                          {product.basicCopy}
                        </p>
                      )}

                      {product.status === "available" && (
                        <span>Open {product.name} →</span>
                      )}
                    </div>

                    <span
                      className={`lab-product-status ${
                        product.status === "available"
                          ? "available"
                          : ""
                      }`}
                    >
                      {labProductStatusLabels[
                        product.status
                      ].toUpperCase()}
                    </span>
                  </>
                );

                if (product.url && product.status === "available") {
                  return (
                    <a
                      key={product.id}
                      href={product.url}
                      className="lab-product-library-card active"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <article
                    key={product.id}
                    className={`lab-product-library-card ${visualStatus}`}
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
