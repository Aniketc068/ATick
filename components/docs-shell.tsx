import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { RepoMenu } from "@/components/repo-menu";

const LANGS = [
  { id: "python", name: "Python" }, { id: "java", name: "Java" }, { id: "dotnet", name: ".NET" },
  { id: "node", name: "Node.js" }, { id: "php", name: "PHP" },
];
const NAV = [
  { group: "Getting started", items: [
    { slug: "", label: "Introduction" }, { slug: "quickstart", label: "Quickstart" }, { slug: "install", label: "Installation" },
  ]},
  { group: "Guide", items: [
    { slug: "signing", label: "Signing" }, { slug: "pades", label: "PAdES levels" }, { slug: "appearance", label: "Appearance" },
    { slug: "certification", label: "Certification & lock" }, { slug: "esign", label: "Deferred / eSign" },
  ]},
  { group: "Reference", items: [{ slug: "api", label: "API reference" }] },
];

export function DocsShell({ lang, section = "", children }: { lang: string; section?: string; children: React.ReactNode }) {
  const base = `/docs/${lang}`;
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="container-x flex h-16 items-center justify-between">
          <Link href="/" aria-label="ATick — home">
            <Logo className="text-2xl" />
          </Link>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <RepoMenu />
          </div>
        </nav>
      </header>

      <div className="container-x grid grid-cols-1 gap-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <details className="docnav lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:overflow-y-auto">
          <summary className="doc-summary flex cursor-pointer list-none items-center justify-between rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground lg:hidden">
            <span>Documentation menu</span>
            <ChevronDown className="doc-chevron h-4 w-4 text-muted-foreground transition-transform" />
          </summary>
          <div className="doc-navbody mt-4 lg:mt-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Language</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {LANGS.map((l) => (
                <Link key={l.id} href={`/docs/${l.id}/`}
                  className={`rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition-colors ${l.id === lang ? "border-white/30 bg-white/[0.08] text-foreground" : "border-white/[0.08] text-muted-foreground hover:border-white/20 hover:text-foreground"}`}>{l.name}</Link>
              ))}
            </div>
            <nav className="mt-7 space-y-6 text-sm">
              {NAV.map((g) => (
                <div key={g.group}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>
                  <ul className="mt-2 space-y-0.5">
                    {g.items.map((it) => {
                      const href = `${base}/${it.slug}${it.slug ? "/" : ""}`;
                      const active = section === it.slug;
                      return <li key={it.slug}><Link href={href} className={`block rounded-lg px-2.5 py-1.5 transition-colors ${active ? "bg-white/[0.07] font-medium text-foreground" : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"}`}>{it.label}</Link></li>;
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </details>

        <article className="prose-docs min-w-0 max-w-3xl">{children}</article>
      </div>
    </div>
  );
}
