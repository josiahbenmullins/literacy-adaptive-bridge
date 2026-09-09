import type { Metadata } from "next";

import LABAppearanceSettings from "@/components/LABAppearanceSettings";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <main className="app-shell">
      <section className="page-heading settings-page-heading">
        <div className="eyebrow">PREFERENCES</div>
        <h1>Settings</h1>
      </section>

      <LABAppearanceSettings />
    </main>
  );
}
