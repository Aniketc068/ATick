import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const SUPPORT_EMAIL = "info@axonatetech.com";

export const metadata: Metadata = {
  title: "Commercial License",
  description:
    "Buy a commercial license for ATick to sell, resell or ship it in a closed-source product. Pricing per product, seat or revenue — contact Axonate Tech.",
  alternates: { canonical: "/license/commercial/" },
};

const includes = [
  "Use ATick in closed-source / proprietary / commercial products",
  "Sell, resell or distribute a product built with ATick",
  "No AGPL source-disclosure obligation for your product",
  "Priority support from Axonate Tech",
  "Pricing tailored per product, per seat or per revenue tier",
];

const steps = [
  ["Tell us about your use", "Product, distribution model and expected scale."],
  ["Get a quote", "We size pricing to your use (per product / seat / revenue)."],
  ["License issued", "Pay the fee and receive your commercial license."],
  ["Ship", "Begin selling or shipping only after the license is issued."],
];

export default function CommercialLicensePage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/license/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Licensing
          </Link>
          <p className="eyebrow mt-6">Paid license</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Commercial license</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Required when you build a product with ATick and{" "}
            <strong className="text-foreground">sell, resell or distribute it commercially</strong>,
            or use ATick in any closed-source / commercial product. You may begin selling or shipping
            only after the commercial-license fee is paid and your license is issued.
          </p>

          <div className="glass mt-10 p-7">
            <h2 className="text-lg font-semibold">What it covers</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {includes.map((p) => (
                <li key={p} className="flex gap-2.5 text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>

          <h2 className="mt-12 text-xl font-semibold">How it works</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {steps.map(([t, d], i) => (
              <div key={t} className="glass-soft p-5">
                <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <div className="glass mt-12 flex flex-col items-start gap-3 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Request a commercial license</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your product and we&apos;ll send a quote.
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
            Free for personal, internal and open-source use under the{" "}
            <Link href="/license/agpl/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">
              GNU AGPL-3.0
            </Link>
            . See the{" "}
            <Link href="/license/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">
              licensing overview
            </Link>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
