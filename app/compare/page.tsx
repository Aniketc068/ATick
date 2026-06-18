import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ATick vs other PDF signing libraries (Python, Java, .NET, Node.js, PHP)",
  description:
    "How ATick compares to the leading PDF digital-signature libraries in every language — pyHanko, endesive, iText, Apache PDFBox, EU DSS, IronPDF, Apryse, @signpdf, SetaPDF-Signer, TCPDF — on PAdES/LTV, the Adobe-valid green-tick appearance, PKCS#11/HSM, eSign, encrypted output and licensing.",
  alternates: { canonical: "/compare/" },
};

type Cell = boolean | string;
type Table = { id: string; name: string; intro: string; cols: string[]; rows: { label: string; vals: Cell[] }[] };

const FEATURES = [
  "PAdES + RFC-3161 timestamp",
  "LTV / PAdES-B-LTA",
  "Adobe-valid green-tick appearance",
  "PKCS#11 / smart-card / HSM",
  "Deferred / remote / eSign",
  "Encrypted output + sign",
  "Free (open-source license)",
];

// vals order = [ATick, competitor1, competitor2]; aligned to FEATURES
const TABLES: Table[] = [
  {
    id: "python", name: "Python", intro: "ATick vs pyHanko and endesive — the popular open-source Python signers.",
    cols: ["ATick", "pyHanko", "endesive"],
    rows: [
      { label: FEATURES[0], vals: [true, true, true] },
      { label: FEATURES[1], vals: [true, true, "Partial"] },
      { label: FEATURES[2], vals: [true, "Manual", "Manual"] },
      { label: FEATURES[3], vals: [true, true, true] },
      { label: FEATURES[4], vals: [true, true, "Partial"] },
      { label: FEATURES[5], vals: [true, "Partial", "Partial"] },
      { label: FEATURES[6], vals: ["AGPL", "MIT", "Permissive"] },
    ],
  },
  {
    id: "java", name: "Java", intro: "ATick vs iText 7, Apache PDFBox and the EU DSS framework.",
    cols: ["ATick", "iText 7", "PDFBox"],
    rows: [
      { label: FEATURES[0], vals: [true, true, true] },
      { label: FEATURES[1], vals: [true, true, "Manual"] },
      { label: FEATURES[2], vals: [true, "Manual", "Manual"] },
      { label: FEATURES[3], vals: [true, true, "Via JCA"] },
      { label: FEATURES[4], vals: [true, true, "Manual"] },
      { label: FEATURES[5], vals: [true, true, true] },
      { label: FEATURES[6], vals: ["AGPL (free)", "Paid / AGPL", "Apache-2.0"] },
    ],
  },
  {
    id: "dotnet", name: ".NET", intro: "ATick vs iText 7 (.NET), IronPDF and Apryse / PDFTron.",
    cols: ["ATick", "iText / IronPDF", "Apryse"],
    rows: [
      { label: FEATURES[0], vals: [true, true, true] },
      { label: FEATURES[1], vals: [true, true, true] },
      { label: FEATURES[2], vals: [true, "Manual", "Manual"] },
      { label: FEATURES[3], vals: [true, true, true] },
      { label: FEATURES[4], vals: [true, "Partial", true] },
      { label: FEATURES[5], vals: [true, true, true] },
      { label: FEATURES[6], vals: ["AGPL (free)", "Paid", "Paid"] },
    ],
  },
  {
    id: "node", name: "Node.js", intro: "ATick vs @signpdf / node-signpdf and pdf-lib.",
    cols: ["ATick", "@signpdf", "pdf-lib"],
    rows: [
      { label: FEATURES[0], vals: [true, "Basic", false] },
      { label: FEATURES[1], vals: [true, false, false] },
      { label: FEATURES[2], vals: [true, "Manual", false] },
      { label: FEATURES[3], vals: [true, "External", false] },
      { label: FEATURES[4], vals: [true, true, false] },
      { label: FEATURES[5], vals: [true, "Partial", false] },
      { label: FEATURES[6], vals: ["AGPL", "MIT", "MIT"] },
    ],
  },
  {
    id: "php", name: "PHP", intro: "ATick vs SetaPDF-Signer and TCPDF.",
    cols: ["ATick", "SetaPDF-Signer", "TCPDF"],
    rows: [
      { label: FEATURES[0], vals: [true, true, "Basic"] },
      { label: FEATURES[1], vals: [true, true, "Manual"] },
      { label: FEATURES[2], vals: [true, true, "Basic"] },
      { label: FEATURES[3], vals: [true, true, false] },
      { label: FEATURES[4], vals: [true, true, false] },
      { label: FEATURES[5], vals: [true, true, "Partial"] },
      { label: FEATURES[6], vals: ["AGPL (free)", "Paid", "LGPL"] },
    ],
  },
];

function Mark({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-brand" aria-label="Yes" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="No" />;
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
            Choosing a library to digitally sign PDFs? <strong className="text-foreground">ATick</strong>{" "}
            is one signing engine with the same API in <strong className="text-foreground">Python, Java,
            .NET, Node.js and PHP</strong>. Here&apos;s how it compares to the leading option in each
            language — across the features that matter for a signature Adobe Reader shows as valid.
          </p>

          {TABLES.map((t) => (
            <section key={t.id} id={t.id} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight">PDF signing in {t.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-left">
                      <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                      {t.cols.map((c, i) => (
                        <th key={c} className={`px-4 py-3 text-center font-semibold ${i === 0 ? "text-brand" : "text-foreground"}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((r) => (
                      <tr key={r.label} className="border-t border-white/[0.06]">
                        <td className="px-4 py-3 text-muted-foreground">{r.label}</td>
                        {r.vals.map((v, i) => (
                          <td key={i} className={`px-4 py-3 text-center ${i === 0 ? "bg-white/[0.02]" : ""}`}><Mark v={v} /></td>
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
            <h2>Why teams pick ATick</h2>
            <ul>
              <li><strong>One API, five languages.</strong> Python, Java, .NET, Node.js and PHP share the same engine and options — no per-language relearning.</li>
              <li><strong>Adobe-valid green-tick appearance out of the box.</strong> Many libraries leave the visual appearance entirely to you.</li>
              <li><strong>Free where the comprehensive options are paid.</strong> In Java, .NET and PHP the full-featured signers (iText, IronPDF, Apryse, SetaPDF) are largely commercial; ATick is free under AGPL-3.0 (commercial license only if you sell it).</li>
              <li><strong>Full feature set.</strong> PAdES-B-LTA, LTV, certified no-changes with LTV, encrypted output, PKCS#11 / HSM, Windows store, DSC and Indian eSign.</li>
            </ul>
            <p>
              Honest note: pyHanko (Python) and the EU DSS (Java) are excellent, mature open-source
              projects; iText, Apryse and SetaPDF are powerful commercial products. ATick&apos;s edge is
              breadth (five languages), the ready-made Adobe-valid appearance, and a free license.
            </p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Comparison reflects publicly documented features at the time of writing — check each
            project&apos;s docs for the latest. ATick is free under{" "}
            <Link href="/license/agpl/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">AGPL-3.0</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
