import type { Metadata, Viewport } from "next";

import LABAccessProvider from "@/components/LABAccessProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

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
    <html lang="en">
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
