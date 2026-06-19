import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://atick.readthedocs.io";
const TITLE = "ATick — Sign PDFs with a green tick valid in Adobe (5 languages)";
const DESC =
  "Digitally sign PDFs with a green tick Adobe shows as valid — in Python, Java, .NET, Node.js & PHP. PAdES, timestamps, LTV. One engine, five languages.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s — ATick" },
  description: DESC,
  applicationName: "ATick",
  authors: [{ name: "Axonate Tech", url: "https://axonatetech.com" }],
  creator: "Axonate Tech",
  publisher: "Axonate Tech",
  keywords: [
    // high-intent Adobe / green-tick searches
    "sign PDF green tick valid in Adobe", "PDF digital signature green tick",
    "green tick not showing in digital signature", "how to get tick mark in digital signature",
    "green check mark digital signature Adobe", "digitally sign PDF valid in Adobe Reader",
    "Adobe Approved Trust List", "AATL", "validate signature Adobe Acrobat Reader",
    "Adobe-style signature appearance",
    // formats & standards
    "PAdES", "PAdES-B-LTA", "CMS signing", "PKCS#7", "RFC-3161 timestamp",
    "LTV", "long-term validation", "DSS", "DocMDP certify", "no-changes signature",
    // key holders
    "PKCS#11", "USB token PDF signing", "DSC token", "Digital Signature Certificate",
    "HSM PDF signing", "smart card", "Windows certificate store signing",
    "Indian eSign", "CCA eSign", "deferred signing", "remote signing",
    // per-language intent
    "sign PDF Python", "sign PDF Java", "sign PDF .NET", "sign PDF Node.js", "sign PDF PHP",
    "PDF signing library", "PDF digital signature SDK", "PDF signing API",
    "encrypted PDF signing", "password protected PDF sign", "ATick",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  verification: { google: "b-zDeFOuoA4eyCite3y6i8wn1Tzyi6zjtOYVpbiERWE" },
  // icons are provided by the app/ convention (app/favicon.ico, app/icon.png,
  // app/apple-icon.png) — Next emits hashed, cache-busted <link> tags automatically.
  openGraph: {
    type: "website",
    siteName: "ATick",
    url: SITE,
    title: TITLE,
    description: DESC,
    images: [{ url: "/brand/atick_logo.png", width: 1200, height: 630, alt: "ATick" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/brand/atick_logo.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ATick",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows, Linux, macOS",
      description: DESC,
      url: SITE,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "Axonate Tech", url: "https://axonatetech.com" },
      publisher: { "@type": "Organization", name: "Axonate Tech", url: "https://axonatetech.com" },
      programmingLanguage: ["Python", "Java", ".NET", "Node.js", "PHP"],
      license: `${SITE}/license/`,
    },
    {
      "@type": "WebSite",
      name: "ATick",
      url: SITE,
      description: DESC,
      inLanguage: "en",
      publisher: { "@type": "Organization", name: "Axonate Tech", url: "https://axonatetech.com" },
    },
    {
      "@type": "Organization",
      name: "Axonate Tech",
      url: "https://axonatetech.com",
      email: "info@axonatetech.com",
      sameAs: ["https://www.linkedin.com/company/axonate-tech/"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
