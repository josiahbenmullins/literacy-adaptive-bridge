"use client";

import { useEffect, useState } from "react";

type AppearanceMode = "light" | "dark";

const THEME_COOKIE_KEY = "lab-theme";

const appearanceOptions: Array<{
  value: AppearanceMode;
  label: string;
  description: string;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Warm paper background with dark text.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low-light reading with a charcoal background.",
  },
];

function readTheme(): AppearanceMode {
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${THEME_COOKIE_KEY}=`));

    const value = match
      ? decodeURIComponent(match.split("=", 2)[1])
      : null;

    return value === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function writeTheme(theme: AppearanceMode) {
  const parts = [
    `${THEME_COOKIE_KEY}=${theme}`,
    "Path=/",
    "Max-Age=31536000",
    "SameSite=Lax",
  ];

  const hostname = window.location.hostname;

  if (
    hostname === "literacyadaptivebridge.com" ||
    hostname.endsWith(".literacyadaptivebridge.com")
  ) {
    parts.push("Domain=.literacyadaptivebridge.com");
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export default function LABAppearanceSettings() {
  const [appearance, setAppearanceState] =
    useState<AppearanceMode>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAppearanceState(readTheme());
    setHydrated(true);
  }, []);

  function setAppearance(next: AppearanceMode) {
    setAppearanceState(next);
    writeTheme(next);

    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
  }

  return (
    <section className="settings-page-card" aria-labelledby="appearance-heading">
      <div className="settings-section-head">
        <div>
          <div className="eyebrow">APPEARANCE</div>
          <h2 id="appearance-heading">Theme</h2>
          <p>Choose how Literacy Adaptive Bridge looks on this device.</p>
        </div>

        <span className="saved-state-label">Saved on this device</span>
      </div>

      <div className="appearance-options" role="radiogroup" aria-label="Theme">
        {appearanceOptions.map((option) => {
          const active = appearance === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              className={`appearance-option ${active ? "active" : ""}`}
              onClick={() => setAppearance(option.value)}
              disabled={!hydrated}
            >
              <span
                className={`appearance-preview ${option.value}`}
                aria-hidden="true"
              >
                <i />
                <b />
                <em />
              </span>

              <span className="appearance-copy">
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>

              <span className="appearance-check" aria-hidden="true">
                {active ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
