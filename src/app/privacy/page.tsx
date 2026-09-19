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
          This policy explains how Literacy Adaptive Bridge handles information
          across its websites, accounts, and applications, including GNT LAB.
        </p>
        <p className="legal-effective-date">
          Effective date: September 19, 2026
        </p>
      </section>

      <div className="legal-content">
        <section>
          <h2>Who we are</h2>
          <p>
            Literacy Adaptive Bridge (&ldquo;LAB,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is operated by Mullins
            Encompass Enterprises. LAB develops adaptive reading tools,
            including GNT LAB.
          </p>
          <p>
            This policy applies to literacyadaptivebridge.com, LAB account
            services, GNT LAB on the web, and GNT LAB mobile applications.
          </p>
        </section>

        <section>
          <h2>Information we collect</h2>

          <h3>Account information</h3>
          <p>
            When you create a LAB account, we collect your email address, a
            unique account identifier, authentication information, and session
            information. Authentication is provided by Supabase. Passwords are
            handled by the authentication provider and are not available to us
            in readable form.
          </p>

          <h3>Reading preferences and product access</h3>
          <p>
            We may store your reading level, appearance settings, saved word
            choices, vocabulary preferences, product entitlements, and related
            settings so that your experience can persist across sessions and
            devices.
          </p>

          <h3>Subscription and transaction information</h3>
          <p>
            If you subscribe to a LAB product, we may receive and store
            subscription status, product identifiers, transaction or customer
            identifiers, renewal and expiration dates, and the platform through
            which the purchase was made. Payment providers process your payment
            details. LAB does not receive or store your complete payment-card
            number.
          </p>

          <h3>Technical information</h3>
          <p>
            Our hosting, authentication, security, and payment providers may
            process technical information such as IP address, browser or device
            type, operating system, timestamps, session cookies, and diagnostic
            or security logs. We use this information to operate, secure, and
            troubleshoot the service.
          </p>

          <h3>Communications</h3>
          <p>
            If you contact us, we collect the information you provide in the
            message and use it to respond to your request.
          </p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Create, authenticate, and maintain LAB accounts.</li>
            <li>Sync reading preferences and settings across devices.</li>
            <li>Verify purchases and provide the correct product access.</li>
            <li>Manage subscriptions, renewals, cancellations, and refunds.</li>
            <li>Provide support and respond to account requests.</li>
            <li>Protect LAB, its users, and its services from misuse or fraud.</li>
            <li>Diagnose problems and improve reliability and usability.</li>
            <li>Comply with legal, tax, accounting, and security obligations.</li>
          </ul>
        </section>

        <section>
          <h2>Cookies and local storage</h2>
          <p>
            LAB uses essential cookies and device storage to keep you signed in,
            remember your appearance and reading settings, and support the
            reader&apos;s operation. These technologies are used for service
            functionality and security, not third-party advertising.
          </p>
        </section>

        <section>
          <h2>Service providers and information sharing</h2>
          <p>
            We share information only as needed to operate LAB, complete
            transactions, comply with law, or protect the service. Depending on
            the feature or purchasing platform you use, providers may include:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> for authentication, account data,
              preferences, and entitlements.
            </li>
            <li>
              <strong>Stripe</strong> for web subscription checkout, billing,
              and subscription management.
            </li>
            <li>
              <strong>Apple</strong> and <strong>Google</strong> for purchases
              made through their respective application stores.
            </li>
            <li>
              <strong>RevenueCat</strong> for validating and synchronizing
              mobile subscription status.
            </li>
            <li>
              <strong>Vercel</strong> for website hosting and delivery.
            </li>
          </ul>
          <p>
            These providers process information under their own terms and
            privacy policies. We may also disclose information when required by
            law or when reasonably necessary to prevent fraud, abuse, or harm.
          </p>
          <p>
            LAB does not sell personal information and does not use personal
            information for third-party targeted advertising.
          </p>
        </section>

        <section>
          <h2>Data retention and deletion</h2>
          <p>
            We retain account information while your account remains active and
            as reasonably necessary to provide LAB services. Reading
            preferences and saved word choices remain associated with your
            account until they are reset or the account is deleted.
          </p>
          <p>
            We may retain limited transaction, tax, fraud-prevention, security,
            or legal records when required or permitted by law. Service
            providers may retain information according to their own legal and
            operational requirements.
          </p>
          <p>
            You may request deletion of your LAB account and associated data by
            contacting us at{" "}
            <a href="mailto:privacy@literacyadaptivebridge.com">
              privacy@literacyadaptivebridge.com
            </a>
            . We may need to verify that you control the account before
            completing the request.
          </p>
          <p>
            Deleting a LAB account does not automatically cancel an active
            subscription billed by Stripe, Apple, or Google. Cancel the
            subscription through the provider that bills you before deleting
            the account.
          </p>
        </section>

        <section>
          <h2>Security</h2>
          <p>
            We use reasonable administrative and technical safeguards designed
            to protect personal information. No online service can guarantee
            absolute security, and you are responsible for protecting your
            password and devices.
          </p>
        </section>

        <section>
          <h2>Children&apos;s privacy</h2>
          <p>
            LAB is an educational service but is not directed specifically to
            children under 13. A child under 13 should use LAB only with the
            involvement and consent of a parent or legal guardian. If you
            believe a child provided personal information without appropriate
            consent, contact us so we can review and delete it as appropriate.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You may review the email address and product access associated with
            your signed-in LAB account. You may also request access,
            correction, or deletion of your personal information by contacting
            us. Additional rights may apply depending on where you live.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            We may update this policy when LAB products, providers, or legal
            requirements change. We will post the revised policy here and
            update the effective date.
          </p>
        </section>

        <section className="legal-contact">
          <h2>Contact</h2>
          <p>
            Privacy questions and requests may be sent to{" "}
            <a href="mailto:privacy@literacyadaptivebridge.com">
              privacy@literacyadaptivebridge.com
            </a>
            .
          </p>
          <p className="legal-placeholder-note">
            Development note: this email address is a placeholder and must be
            activated before application-store submission.
          </p>
        </section>
      </div>
    </main>
  );
}
