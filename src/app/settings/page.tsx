import type { Metadata } from "next";

import LABAppearanceSettings from "@/components/LABAppearanceSettings";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <main className="app-shell">
      <section className="page-heading">
        <div className="eyebrow">PREFERENCES</div>
        <h1>Settings</h1>
        <p>
          Preferences for Literacy Adaptive Bridge and your LAB products.
        </p>
      </section>

      <LABAppearanceSettings />
    </main>
  );
}
