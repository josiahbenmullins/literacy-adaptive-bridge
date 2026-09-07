import type { Metadata, Viewport } from "next";

import LABAccessProvider from "@/components/LABAccessProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const themeBootScript = `
(function () {
  try {
    var row = document.cookie
      .split("; ")
      .find(function (item) {
        return item.indexOf("lab-theme=") === 0;
      });

    var value = row
      ? decodeURIComponent(row.split("=", 2)[1])
      : "light";

    var theme = value === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export const metadata: Metadata = {
  title: {
    default: "Literacy Adaptive Bridge",
    template: "%s · Literacy Adaptive Bridge",
  },
  description:
    "Adaptive original-language reading tools from Literacy Adaptive Bridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>

      <body>
        <LABAccessProvider>
          <SiteHeader />
          {children}
        </LABAccessProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
