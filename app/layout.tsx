import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://atick.dev"),
  title: "ATick — PDF digital signatures in 5 languages",
  description:
    "ATick is a standalone PDF digital-signature library for Python, Java, .NET, Node.js and PHP — PAdES/CMS signing, RFC-3161 timestamps, LTV and a green-tick appearance Adobe shows as valid.",
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }] },
  openGraph: {
    title: "ATick — PDF digital signatures in 5 languages",
    description: "PAdES/CMS signing, timestamps, LTV and a green-tick appearance Adobe shows as valid.",
    images: ["/brand/atick_logo.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
