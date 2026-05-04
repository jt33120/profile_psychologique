import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personality Fusion Quiz",
  description: "Astrology, numerology, Big Five, Enneagram, and Human Design synthesis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
