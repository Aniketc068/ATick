"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Github } from "lucide-react";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/docs/python/", label: "Docs" },
  { href: "/#languages", label: "Languages" },
  { href: "/#features", label: "Features" },
  { href: "/about/", label: "About" },
];

const REPOS = [
  { name: "Python", url: "https://github.com/Aniketc068/ATick-Python" },
  { name: "Java", url: "https://github.com/Aniketc068/ATick-Java" },
  { name: ".NET", url: "https://github.com/Aniketc068/ATick-DotNet" },
  { name: "Node.js", url: "https://github.com/Aniketc068/ATick-Node" },
  { name: "PHP", url: "https://github.com/Aniketc068/ATick-PHP" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <>
          <button
            aria-hidden="true" tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/[0.08] bg-[hsl(240_6%_6%)] px-5 py-5">
            <Link href="/" onClick={() => setOpen(false)} aria-label="ATick — home" className="mb-4 inline-block">
              <Logo className="text-2xl" />
            </Link>
            <nav className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-white/[0.05]">
                  {l.label}
                </Link>
              ))}
            </nav>

            <p className="mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Source — by language</p>
            <div className="mt-1 flex flex-col gap-1">
              {REPOS.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground">
                  <Github className="h-4 w-4 opacity-60" /> ATick for {r.name}
                </a>
              ))}
            </div>

            <Link href="/docs/python/" onClick={() => setOpen(false)}
              className="mt-5 flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              Get started
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
