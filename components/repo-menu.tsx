"use client";

import { useEffect, useRef, useState } from "react";
import { Github, ChevronDown } from "lucide-react";

const REPOS = [
  { name: "Python", url: "https://github.com/Aniketc068/ATick-Python" },
  { name: "Java", url: "https://github.com/Aniketc068/ATick-Java" },
  { name: ".NET", url: "https://github.com/Aniketc068/ATick-DotNet" },
  { name: "Node.js", url: "https://github.com/Aniketc068/ATick-Node" },
  { name: "PHP", url: "https://github.com/Aniketc068/ATick-PHP" },
];

export function RepoMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)} aria-label="GitHub repositories" aria-expanded={open}
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <Github className="h-5 w-5" />
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.1] bg-[hsl(240_6%_9%)] py-1 shadow-2xl backdrop-blur-xl">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Source — by language</p>
          {REPOS.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-white/[0.06]">
              <Github className="h-4 w-4 opacity-60" /> ATick for {r.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
