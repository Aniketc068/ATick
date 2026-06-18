import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ATick vs pyHanko vs endesive — PDF signing libraries compared",
  description:
    "How ATick compares to pyHanko, endesive and other PDF digital-signature libraries: languages supported, PAdES levels, LTV, the Adobe-valid green-tick appearance, PKCS#11 / HSM, eSign and encrypted output.",
  alternates: { canonical: "/compare/" },
};

type Cell = boolean | string;
const cols = ["ATick", "pyHanko", "endesive"];
const rows: { label: string; vals: Cell[] }[] = [
  { label: "Languages", vals: ["Python, Java, .NET, Node.js, PHP", "Python", "Python"] },
  { label: "Same API across languages", vals: [true, false, false] },
  { label: "PAdES B-B / B-T (timestamp)", vals: [true, true, true] },
  { label: "PAdES B-LT / B-LTA (LTV)", vals: [true, true, "Partial"] },
  { label: "RFC-3161 timestamps", vals: [true, true, true] },
  { label: "Adobe-valid green-tick appearance", vals: [true, "Manual", "Manual"] },
  { label: "DocMDP certify (no-changes)", vals: [true, true, "Partial"] },
  { label: "Encrypted output + sign", vals: [true, "Partial", "Partial"] },
  { label: "PKCS#11 / smart-card / HSM", vals: [true, true, true] },
  { label: "Windows certificate store", vals: [true, false, false] },
  { label: "Deferred / remote / eSign", vals: [true, true, "Partial"] },
  { label: "Single self-contained install", vals: [true, "pip + deps", "pip + deps"] },
  { label: "License", vals: ["AGPL-3.0 / Commercial", "MIT", "permissive"] },
];

function Mark({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-brand" aria-label="Yes" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="No" />;
  return <span className="text-foreground/80">{v}</span>;
}

export default function ComparePage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">Comparison</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            ATick vs pyHanko vs endesive
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Choosing a library to digitally sign PDFs? Here&apos;s how <strong className="text-foreground">ATick</strong>{" "}
            compares to two popular open-source Python options — pyHanko and endesive — across the
            features that matter for a signature Adobe Reader shows as valid.
          </p>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-white/[0.03] text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                  {cols.map((c, i) => (
                    <th key={c} className={`px-4 py-3 text-center font-semibold ${i === 0 ? "text-brand" : "text-foreground"}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
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

          <div className="prose-docs mt-12">
            <h2>When to choose ATick</h2>
            <ul>
              <li>You need the <strong>same signing API in more than one language</strong> — Python, Java, .NET, Node.js and PHP all share one engine and the same options.</li>
              <li>You want a <strong>verified green-tick appearance Adobe Reader renders as valid</strong> out of the box, with a configurable logo and validity mark.</li>
              <li>You need <strong>PAdES-B-LTA</strong> (long-term validation), <strong>certified no-changes (certify=1) with LTV</strong>, or <strong>encrypted output that stays signed</strong>.</li>
              <li>You sign with <strong>PKCS#11 tokens / HSM, the Windows certificate store, DSC tokens</strong>, or via <strong>deferred / Indian eSign</strong> flows.</li>
            </ul>

            <h2>When pyHanko or endesive fit</h2>
            <p>
              <strong>pyHanko</strong> is a mature, comprehensive Python-only library with deep PAdES
              and validation support and an MIT license — an excellent choice for Python-only projects
              that want fine-grained control. <strong>endesive</strong> is a lightweight, permissively
              licensed Python toolkit for signing and verifying PDF, XML and mail. If your stack is
              Python-only and you don&apos;t need the cross-language API or the ready-made Adobe-valid
              appearance, both are solid.
            </p>

            <h2>The short version</h2>
            <p>
              ATick&apos;s differentiator is <strong>one engine, five languages</strong>, with an
              Adobe-valid green-tick appearance and the full PAdES / LTV / certify / encrypted-output
              feature set behind a single, consistent API. Start with the{" "}
              <Link href="/docs/python/">documentation</Link> or read about{" "}
              <Link href="/docs/python/pades/">PAdES &amp; LTV</Link>.
            </p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Comparison reflects publicly documented features at the time of writing; check each
            project&apos;s docs for the latest. Free under{" "}
            <Link href="/license/agpl/" className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">AGPL-3.0</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
