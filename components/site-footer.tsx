import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { Logo } from "@/components/logo";

const SUPPORT_EMAIL = "info@axonatetech.com";
const COMPANY_URL = "https://axonatetech.com/";

const cols = [
  { title: "Docs", links: [
    { href: "/docs/python/", label: "Python" }, { href: "/docs/java/", label: "Java" },
    { href: "/docs/dotnet/", label: ".NET" }, { href: "/docs/node/", label: "Node.js" }, { href: "/docs/php/", label: "PHP" },
  ]},
  { title: "Packages", links: [
    { href: "https://pypi.org/project/atick/", label: "PyPI", ext: true },
    { href: "https://central.sonatype.com/artifact/io.github.aniketc068/atick", label: "Maven Central", ext: true },
    { href: "https://www.nuget.org/packages/ATick/", label: "NuGet", ext: true },
    { href: "https://www.npmjs.com/package/atick", label: "npm", ext: true },
    { href: "https://packagist.org/packages/aniketc068/atick", label: "Packagist", ext: true },
  ]},
  { title: "License", links: [
    { href: "/license/agpl/", label: "AGPL-3.0 — free" },
    { href: "/license/commercial/", label: "Commercial — paid" },
    { href: "/license/", label: "Licensing terms" },
  ]},
  { title: "Company", links: [
    { href: COMPANY_URL, label: "Axonate Tech", ext: true },
    { href: "https://axonatetech.com/company/about-us", label: "About us", ext: true },
    { href: "https://axonatetech.com/solutions/document-processing", label: "Other services", ext: true },
    { href: "https://www.linkedin.com/company/axonate-tech/", label: "LinkedIn", ext: true },
  ]},
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[hsl(240_7%_3%)]">
      <div className="container-x grid grid-cols-2 gap-8 py-14 sm:grid-cols-6">
        <div className="col-span-2">
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Standalone PDF digital signatures — PAdES/CMS, timestamps &amp; LTV. One engine, five languages.</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-foreground/85 transition-colors hover:border-white/25 hover:text-foreground">
            <Mail className="h-4 w-4 text-primary" /> {SUPPORT_EMAIL}
          </a>
          <p className="mt-2 text-xs text-muted-foreground/70">Support &amp; commercial licensing</p>
          <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            A product by <span className="font-semibold text-foreground/90">Axonate Tech</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground/70">AI data annotation &amp; document-processing services.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  {"ext" in l && l.ext
                    ? <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>
                    : <Link href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© 2026 <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Axonate Tech</a> · <Link href="/license/" className="hover:text-foreground">Dual-licensed AGPL-3.0 / Commercial</Link></p>
        <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-foreground">{SUPPORT_EMAIL}</a> · <span className="font-mono">v1.0.6</span></p>
      </div>
    </footer>
  );
}
