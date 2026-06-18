import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ATick vs other PDF signing libraries (Python, Java, .NET, Node.js, PHP)",
  description:
    "An accurate comparison of ATick with the leading PDF digital-signature libraries — pyHanko, endesive, iText, Apache PDFBox, IronPDF, Apryse, @signpdf, pdf-lib, SetaPDF-Signer, TCPDF. ATick is the only library with a current Adobe-valid green-tick appearance, one API across five languages, a built-in Windows certificate-store connector, and a free, batteries-included PAdES-B-LTA pipeline.",
  alternates: { canonical: "/compare/" },
};

type Cell = boolean | string;

// ---- what only ATick gives (verified against each project's docs) ----
const edge: { cap: string; atick: string; rivals: string }[] = [
  { cap: "Adobe-valid green-tick appearance", atick: "Built-in, current", rivals: "Only iText had it — now deprecated; no other library ships it" },
  { cap: "One API across 5 languages", atick: "Python, Java, .NET, Node.js, PHP", rivals: "Every rival is single-language / single-platform" },
  { cap: "Windows certificate-store connector", atick: "Built-in, in every language", rivals: "Only IronPDF (.NET) has a one-liner; everyone else is DIY" },
  { cap: "Free AND batteries-included", atick: "Yes — AGPL-3.0 (commercial only to resell)", rivals: "Turnkey rivals (iText, IronPDF, Apryse, SetaPDF) are paid; the free turnkey one (pyHanko) is Python-only" },
  { cap: "Certified no-changes (certify=1) + LTV + encrypted", atick: "Built-in combination", rivals: "Rare or manual to combine elsewhere" },
];

type Table = { id: string; name: string; intro: string; cols: string[]; rows: { label: string; vals: Cell[] }[] };

const F = [
  "PAdES B-LTA (named levels)",
  "Built-in RFC-3161 timestamp",
  "Built-in LTV / DSS (one call)",
  "Adobe-valid green-tick appearance",
  "Windows cert-store connector (built-in)",
  "PKCS#11 / smart-card / HSM",
  "Deferred / remote / eSign",
  "Encrypted output + sign",
  "Free license",
];

const TABLES: Table[] = [
  {
    id: "python", name: "Python", intro: "ATick vs pyHanko and endesive (both free, MIT).",
    cols: ["ATick", "pyHanko", "endesive"],
    rows: [
      { label: F[0], vals: [true, true, "Partial"] },
      { label: F[1], vals: [true, true, true] },
      { label: F[2], vals: [true, true, "OCSP only"] },
      { label: F[3], vals: [true, false, false] },
      { label: F[4], vals: [true, false, false] },
      { label: F[5], vals: [true, true, true] },
      { label: F[6], vals: [true, true, true] },
      { label: F[7], vals: [true, true, true] },
      { label: F[8], vals: ["AGPL", "MIT", "MIT"] },
    ],
  },
  {
    id: "java", name: "Java", intro: "ATick vs iText 7 and Apache PDFBox.",
    cols: ["ATick", "iText 7", "PDFBox"],
    rows: [
      { label: F[0], vals: [true, true, "Manual"] },
      { label: F[1], vals: [true, true, "Manual"] },
      { label: F[2], vals: [true, true, "Manual"] },
      { label: F[3], vals: [true, "Deprecated", false] },
      { label: F[4], vals: [true, false, false] },
      { label: F[5], vals: [true, true, "DIY"] },
      { label: F[6], vals: [true, true, "Manual"] },
      { label: F[7], vals: [true, true, "Limited"] },
      { label: F[8], vals: ["AGPL", "AGPL / Paid", "Apache-2.0"] },
    ],
  },
  {
    id: "dotnet", name: ".NET", intro: "ATick vs iText 7, IronPDF and Apryse (PDFTron).",
    cols: ["ATick", "iText 7", "IronPDF", "Apryse"],
    rows: [
      { label: F[0], vals: [true, true, false, "Assembled"] },
      { label: F[1], vals: [true, true, true, true] },
      { label: F[2], vals: [true, true, false, true] },
      { label: F[3], vals: [true, "Deprecated", false, false] },
      { label: F[4], vals: [true, "DIY", true, "Manual"] },
      { label: F[5], vals: [true, true, true, "Custom"] },
      { label: F[6], vals: [true, true, false, true] },
      { label: F[7], vals: [true, true, "Unclear", true] },
      { label: F[8], vals: ["AGPL", "AGPL / Paid", "Paid", "Paid"] },
    ],
  },
  {
    id: "node", name: "Node.js", intro: "ATick vs @signpdf / node-signpdf and pdf-lib — the Node ecosystem has no full PAdES/LTV signer.",
    cols: ["ATick", "@signpdf", "pdf-lib"],
    rows: [
      { label: F[0], vals: [true, "B-B only", false] },
      { label: F[1], vals: [true, false, false] },
      { label: F[2], vals: [true, false, false] },
      { label: F[3], vals: [true, false, false] },
      { label: F[4], vals: [true, false, false] },
      { label: F[5], vals: [true, false, false] },
      { label: F[6], vals: [true, "DIY", false] },
      { label: F[7], vals: [true, false, false] },
      { label: F[8], vals: ["AGPL", "MIT", "MIT"] },
    ],
  },
  {
    id: "php", name: "PHP", intro: "ATick vs SetaPDF-Signer (commercial) and TCPDF (free, deprecated).",
    cols: ["ATick", "SetaPDF-Signer", "TCPDF"],
    rows: [
      { label: F[0], vals: [true, "Compose", false] },
      { label: F[1], vals: [true, true, false] },
      { label: F[2], vals: [true, "Multi-step", false] },
      { label: F[3], vals: [true, false, false] },
      { label: F[4], vals: [true, false, false] },
      { label: F[5], vals: [true, "Add-on", false] },
      { label: F[6], vals: [true, true, false] },
      { label: F[7], vals: [true, true, false] },
      { label: F[8], vals: ["AGPL", "Paid", "LGPL"] },
    ],
  },
];

function Mark({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-brand" aria-label="Yes" />;
  if (v === false) return <X className="mx-auto h-4 w-4 text-red-400/70" aria-label="No" />;
  return <span className="text-xs text-foreground/80">{v}</span>;
}

export default function ComparePage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">Comparison</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            ATick vs other PDF signing libraries
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            An honest, researched comparison. <strong className="text-foreground">ATick</strong> is one
            signing engine with the same API in <strong className="text-foreground">Python, Java, .NET,
            Node.js and PHP</strong> — and it ships the things rivals either dropped, never had, or
            charge for.
          </p>

          {/* what only ATick gives */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight">What only ATick gives</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="bg-white/[0.03] text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Capability</th>
                  <th className="px-4 py-3 font-semibold text-brand">ATick</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Everyone else</th>
                </tr>
              </thead>
              <tbody>
                {edge.map((e) => (
                  <tr key={e.cap} className="border-t border-white/[0.06] align-top">
                    <td className="px-4 py-3 text-muted-foreground">{e.cap}</td>
                    <td className="px-4 py-3 bg-white/[0.02]">
                      <span className="inline-flex items-start gap-1.5 font-medium text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {e.atick}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.rivals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The in-document Adobe green tick was a one-tag feature only in <strong className="text-foreground">iText 5</strong>;
            iText 7/8 still expose <code>SetAcro6Layers</code> but <strong className="text-foreground">deprecated</strong> it,
            and no other library implements it. ATick is the only one that ships it as a current feature.
          </p>

          {/* per-language accurate tables */}
          {TABLES.map((t) => (
            <section key={t.id} id={t.id} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight">PDF signing in {t.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-left">
                      <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                      {t.cols.map((c, i) => (
                        <th key={c} className={`px-3 py-3 text-center font-semibold ${i === 0 ? "text-brand" : "text-foreground"}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((r) => (
                      <tr key={r.label} className="border-t border-white/[0.06]">
                        <td className="px-4 py-3 text-muted-foreground">{r.label}</td>
                        {r.vals.map((v, i) => (
                          <td key={i} className={`px-3 py-3 text-center ${i === 0 ? "bg-white/[0.02]" : ""}`}><Mark v={v} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                <Link href={`/docs/${t.id}/`} className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">ATick for {t.name} docs →</Link>
              </p>
            </section>
          ))}

          <div className="prose-docs mt-14">
            <h2>The honest verdict</h2>
            <p>
              The rivals are good at what they do: <strong>pyHanko</strong> (Python) is a free,
              standards-rigorous library with automatic LTV and timestamping; <strong>iText</strong>,
              <strong> Apryse</strong> and <strong>SetaPDF-Signer</strong> are powerful, production-grade
              products. But each is <strong>single-language</strong>, none ships a current
              Adobe-valid green tick, and the turnkey ones are <strong>paid</strong> (or AGPL).
            </p>
            <p>
              ATick&apos;s edge is the combination no one else offers: <strong>one API in five
              languages</strong>, a <strong>current Adobe-valid green-tick appearance</strong>, a
              <strong> built-in Windows certificate-store connector</strong>, and a full
              <strong> PAdES-B-LTA / LTV / certify / encrypted</strong> pipeline that is
              <strong> free under AGPL-3.0</strong> (a commercial license is only needed to resell it).
              In <strong>Node.js</strong> especially, there is no comparable full PAdES/LTV signer at all.
            </p>
            <p>Start with the <Link href="/docs/python/">documentation</Link> or read about <Link href="/docs/python/pades/">PAdES &amp; LTV</Link>.</p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Comparison researched against each project&apos;s official documentation at the time of
            writing — check their docs for the latest. ATick is free under{" "}
            <Link href="/license/agpl/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">AGPL-3.0</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
