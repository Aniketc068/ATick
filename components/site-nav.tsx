import Link from "next/link";
import { Logo } from "@/components/logo";
import { RepoMenu } from "@/components/repo-menu";

export function SiteNav() {
  const links = [
    { href: "/docs/python/", label: "Docs" },
    { href: "/#languages", label: "Languages" },
    { href: "/#features", label: "Features" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="ATick — home">
          <Logo className="text-[1.6rem]" />
        </Link>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block"><RepoMenu /></div>
          <Link href="/docs/python/" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
