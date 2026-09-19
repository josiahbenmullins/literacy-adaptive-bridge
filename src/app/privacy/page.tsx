import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Literacy Adaptive Bridge and GNT LAB.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="app-shell legal-page">
      <section className="page-heading legal-page-heading">
        <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>
        <h1>Privacy Policy</h1>
        <p>
          This policy applies to literacyadaptivebridge.com, LAB accounts,
          GNT LAB on the web, and GNT LAB mobile applications.
        </p>
        <p className="legal-effective-date">
          Effective date: September 19, 2026
        </p>
      </section>

      <div className="legal-content">
        <section>
          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Account data:</strong> email address, account identifier,
              authentication data, and session information.
            </li>
            <li>
              <strong>Reader data:</strong> reading level, appearance settings,
              saved word choices, vocabulary preferences, and product access.
            </li>
            <li>
              <strong>Subscription data:</strong> subscription status, product
              and transaction identifiers, billing provider, and renewal or
              expiration dates. LAB does not store complete payment-card
              numbers.
            </li>
            <li>
              <strong>Technical data:</strong> service providers may process IP
              address, browser or device type, operating system, timestamps,
              cookies, and diagnostic or security logs.
            </li>
            <li>
              <strong>Communications:</strong> information you provide when
              contacting us.
            </li>
          </ul>
        </section>

        <section>
          <h2>How we use information</h2>
          <ul>
            <li>Authenticate and maintain LAB accounts.</li>
            <li>Save and synchronize reader settings.</li>
            <li>Verify purchases and provide product access.</li>
            <li>Manage subscriptions and account requests.</li>
            <li>Operate, secure, and troubleshoot LAB services.</li>
            <li>Meet applicable legal and financial record requirements.</li>
          </ul>
        </section>

        <section>
          <h2>Service providers</h2>
          <p>
            We provide data only as needed to operate LAB:
          </p>
          <ul>
            <li><strong>Supabase:</strong> accounts, authentication, settings, and access records.</li>
            <li><strong>Stripe:</strong> web subscriptions and billing.</li>
            <li><strong>Apple and Google:</strong> mobile-app purchases.</li>
            <li><strong>RevenueCat:</strong> mobile subscription verification.</li>
            <li><strong>Vercel:</strong> website hosting and delivery.</li>
          </ul>
          <p>
            LAB does not sell personal information or use it for third-party
            targeted advertising.
          </p>
        </section>

        <section>
          <h2>Cookies and device storage</h2>
          <p>
            LAB uses essential cookies and device storage to maintain sessions
            and remember account, appearance, and reader settings.
          </p>
        </section>

        <section>
          <h2>Retention and deletion</h2>
          <p>
            Account and reader data are retained while the account remains
            active. Limited transaction, security, tax, or legal records may be
            retained when required.
          </p>
          <p>
            To request account and data deletion, contact{" "}
            <a href="mailto:privacy@literacyadaptivebridge.com">
              privacy@literacyadaptivebridge.com
            </a>
            . We may verify account ownership before deletion.
          </p>
          <p>
            Account deletion does not cancel a subscription billed by Stripe,
            Apple, or Google. Cancel it through the billing provider.
          </p>
        </section>

        <section>
          <h2>Security</h2>
          <p>
            We use reasonable safeguards to protect personal information. No
            online service can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            LAB is not directed to children under 13. Children under 13 should
            use LAB only with a parent or legal guardian.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            Policy changes will be posted on this page with a revised effective
            date.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Privacy questions and requests may be sent to{" "}
            <a href="mailto:privacy@literacyadaptivebridge.com">
              privacy@literacyadaptivebridge.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
