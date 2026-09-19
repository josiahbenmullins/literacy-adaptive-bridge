import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Literacy Adaptive Bridge products and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="app-shell legal-page">
      <section className="page-heading legal-page-heading">
        <div className="eyebrow">LITERACY ADAPTIVE BRIDGE</div>
        <h1>Privacy Policy</h1>
        <p>
          This policy applies to literacyadaptivebridge.com, LAB accounts,
          and every LAB website, application, product, or service that links to
          it, including GNT LAB.
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
            LAB requires these providers to use personal information only to
            provide their services to LAB and to protect it consistently with
            this policy and applicable law.
          </p>
          <p>
            We may disclose information when required by law or legal process,
            or when reasonably necessary to protect the rights, safety, or
            security of LAB, its users, or others.
          </p>
        </section>

        <section>
          <h2>Cookies and tracking</h2>
          <p>
            LAB uses essential cookies and device storage to maintain sessions
            and remember account, appearance, and reader settings.
          </p>
          <p>
            LAB does not sell personal information, share it for cross-context
            behavioral advertising, or track activity across unrelated websites
            or apps for advertising. Because LAB does not perform that tracking,
            browser Do Not Track signals do not change how LAB operates.
          </p>
        </section>

        <section id="account-deletion">
          <h2>Retention and account deletion</h2>
          <p>
            Account and reader data are retained while the account remains
            active or as needed to provide LAB services. After a verified
            deletion request, LAB deletes the account and associated reader
            data. Limited transaction, security, tax, or legal records may be
            retained when required or permitted by law.
          </p>
          <p>
            To request account and data deletion, contact{" "}
            <a href="mailto:literacyadaptivebridge@protonmail.com">
              literacyadaptivebridge@protonmail.com
            </a>
            . We may verify account ownership before deletion.
          </p>
          <p>
            Account deletion does not cancel a subscription billed by Stripe,
            Apple, or Google. Cancel it through the billing provider.
          </p>
        </section>

        <section>
          <h2>Your privacy rights</h2>
          <p>
            Depending on where you live, you may have the right to request
            access to, correction of, a copy of, or deletion of your personal
            information, or to object to or restrict certain processing. Submit
            a request using the contact address below. We may verify your
            identity before acting on a request. LAB will not discriminate
            against you for exercising an applicable privacy right.
          </p>
        </section>

        <section>
          <h2>Legal basis and international processing</h2>
          <p>
            Where a legal basis is required, LAB processes information to
            provide the services and subscriptions you request, comply with
            legal obligations, and pursue its legitimate interests in operating
            and securing LAB. Information may be processed in the United States
            and other countries where the service providers listed above
            operate, using safeguards required by applicable law.
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
            LAB is not directed to children under 13, and we do not knowingly
            collect personal information from children under 13. If we learn
            that we have collected such information, we will delete it.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            Policy changes will be posted on this page with a revised effective
            date. Additional notice will be provided when required by law.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Privacy questions and requests may be sent to{" "}
            <a href="mailto:literacyadaptivebridge@protonmail.com">
              literacyadaptivebridge@protonmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
