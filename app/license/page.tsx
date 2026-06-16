import type { Metadata } from "next";
import Link from "next/link";
import { Check, Mail } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const SUPPORT_EMAIL = "aniketc.pro@gmail.com";

export const metadata: Metadata = {
  title: "Licensing",
  description:
    "ATick is dual-licensed: free under the GNU AGPL-3.0 for personal, internal and open-source use; a paid commercial license is required to sell or ship it in a closed-source / commercial product.",
  alternates: { canonical: "/license/" },
};

const tiers = [
  {
    name: "AGPL-3.0",
    tag: "Free",
    price: "$0",
    accent: false,
    blurb: "Free under the GNU AGPL-3.0 for non-commercial and open use.",
    points: [
      "Personal projects, learning and evaluation",
      "Internal / in-house use",
      "Open-source projects released publicly under AGPL-3.0",
      "Use, study and modify at no cost",
    ],
    cta: { label: "Read the AGPL-3.0", href: "/license/agpl/", ext: false },
  },
  {
    name: "Commercial",
    tag: "Paid",
    price: "Quote",
    accent: true,
    blurb: "Required to sell, resell or ship ATick in a closed-source / commercial product.",
    points: [
      "Selling a product built with ATick",
      "Closed-source / proprietary / commercial products",
      "Begin shipping only after the fee is paid and your license is issued",
      "Pricing per product / per seat / per revenue tier",
    ],
    cta: { label: "Request a quote", href: `mailto:${SUPPORT_EMAIL}?subject=ATick%20Commercial%20License`, ext: true },
  },
];

const table = [
  ["Personal / learning / internal", "AGPL-3.0", "Free"],
  ["Open-source project (public, AGPL-3.0)", "AGPL-3.0", "Free"],
  ["Selling a product built with ATick", "Commercial", "Paid"],
  ["Closed-source / proprietary / commercial product", "Commercial", "Paid"],
];

export default function LicensePage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Licensing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Free to use. <span className="text-muted-foreground">Paid to sell.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            ATick is <strong className="text-foreground">dual-licensed</strong> — free for personal,
            internal and open-source use, and a paid commercial license when you build a product with
            it and sell it.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`glass flex flex-col p-7 ${t.accent ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{t.name}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      t.accent
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/[0.08] text-foreground/80"
                    }`}
                  >
                    {t.tag}
                  </span>
                </div>
                <p className="mt-1 text-3xl font-bold tracking-tight">{t.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">{t.blurb}</p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.cta.href}
                  target={t.cta.ext ? "_blank" : undefined}
                  rel={t.cta.ext ? "noopener noreferrer" : undefined}
                  className={`mt-7 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    t.accent
                      ? "bg-primary text-primary-foreground"
                      : "border border-white/[0.12] bg-white/[0.03] text-foreground hover:border-white/25"
                  }`}
                >
                  {t.cta.label}
                </a>
              </div>
            ))}
          </div>

          <div className="prose-docs mt-16">
            <h2>Which license do I need?</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white/[0.03] text-left">
                    <th className="px-4 py-3 font-semibold text-foreground">Your use</th>
                    <th className="px-4 py-3 font-semibold text-foreground">License</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row) => (
                    <tr key={row[0]} className="border-t border-white/[0.06]">
                      <td className="px-4 py-3 text-muted-foreground">{row[0]}</td>
                      <td className="px-4 py-3 text-foreground/85">{row[1]}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            row[2] === "Free" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {row[2]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>1. Free — GNU AGPL-3.0</h2>
            <p>
              ATick is free under the GNU AGPL-3.0 for personal projects, learning and evaluation;
              internal / in-house use; and open-source projects released publicly under AGPL-3.0. You
              may use, study and modify it at no cost.
            </p>

            <h2>2. Paid — Commercial license (required to sell)</h2>
            <p>
              If you build a product with ATick and <strong>sell, resell or distribute it
              commercially</strong>, or use ATick in any closed-source / commercial product, you must
              purchase a commercial license first. You may begin selling or shipping only after the
              commercial-license fee is paid and your license is issued. Pricing depends on use (per
              product / per seat / per revenue tier).
            </p>
            <p>
              Selling or shipping a commercial product built on ATick <strong>without</strong> a paid
              commercial license violates this license.
            </p>
          </div>

          <div className="glass mt-12 flex flex-col items-start gap-3 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Need a commercial license?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get a quote tailored to your product and scale.
              </p>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=ATick%20Commercial%20License`}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Back to <Link href="/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">home</Link>{" "}
            · <Link href="/docs/python/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">documentation</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
