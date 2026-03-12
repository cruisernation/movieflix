import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineNova | Discover Your Next Favorite Film",
  description:
    "A unique movie discovery app with mood-based picks, cosmic visuals, and personalized watchlist vibes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
