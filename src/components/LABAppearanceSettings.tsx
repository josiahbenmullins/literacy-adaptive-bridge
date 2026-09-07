"use client";

import { useEffect, useState } from "react";

type AppearanceMode = "light" | "dark";

const THEME_COOKIE_KEY = "lab-theme";

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

  useEffect(() => {
    setAppearanceState(readTheme());
  }, []);

  function setAppearance(next: AppearanceMode) {
    setAppearanceState(next);
    writeTheme(next);

    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
  }

  return (
    <section className="lab-settings-card">
      <div>
        <div className="eyebrow">APPEARANCE</div>
        <h2>Theme</h2>
        <p>
          Your appearance preference is shared with LAB products
          on this browser.
        </p>
      </div>

      <div className="lab-theme-options">
        <button
          type="button"
          onClick={() => setAppearance("light")}
          className={
            appearance === "light"
              ? "lab-theme-button active"
              : "lab-theme-button"
          }
        >
          Light
        </button>

        <button
          type="button"
          onClick={() => setAppearance("dark")}
          className={
            appearance === "dark"
              ? "lab-theme-button active"
              : "lab-theme-button"
          }
        >
          Dark
        </button>
      </div>
    </section>
  );
}
