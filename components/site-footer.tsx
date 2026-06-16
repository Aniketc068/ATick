import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";

const SUPPORT_EMAIL = "aniketc.pro@gmail.com";

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
    { href: "https://www.gnu.org/licenses/agpl-3.0.html", label: "AGPL-3.0 — free", ext: true },
    { href: `mailto:${SUPPORT_EMAIL}?subject=ATick%20Commercial%20License`, label: "Commercial — paid", ext: true },
    { href: "https://github.com/Aniketc068/ATick-Python/blob/main/LICENSING.md", label: "Licensing terms", ext: true },
  ]},
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[hsl(240_7%_3%)]">
      <div className="container-x grid grid-cols-2 gap-8 py-14 sm:grid-cols-5">
        <div className="col-span-2">
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Standalone PDF digital signatures — PAdES/CMS, timestamps &amp; LTV. One engine, five languages.</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-foreground/85 transition-colors hover:border-white/25 hover:text-foreground">
            <Mail className="h-4 w-4 text-primary" /> {SUPPORT_EMAIL}
          </a>
          <p className="mt-2 text-xs text-muted-foreground/70">Support &amp; commercial licensing</p>
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
        <p>© 2026 Aniket Chaturvedi · Dual-licensed <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">AGPL-3.0</a> / Commercial</p>
        <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-foreground">{SUPPORT_EMAIL}</a> · <span className="font-mono">v1.0.6</span></p>
      </div>
    </footer>
  );
}
