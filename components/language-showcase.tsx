"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type LangItem = {
  id: string; name: string; reg: string; file: string; install: string; codeHtml: string;
};

export function LanguageShowcase({ langs }: { langs: LangItem[] }) {
  const [active, setActive] = useState(langs[0]?.id);
  const [copied, setCopied] = useState(false);
  const lang = langs.find((l) => l.id === active) ?? langs[0];

  const copy = async (txt: string) => {
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div role="tablist" className="flex flex-wrap justify-center gap-2">
        {langs.map((l) => (
          <button
            key={l.id} role="tab" aria-selected={active === l.id} onClick={() => setActive(l.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer backdrop-blur-md",
              active === l.id ? "border-white/30 bg-white/[0.08] text-foreground" : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:border-white/20"
            )}
          >{l.name}</button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass-soft flex min-w-0 items-center gap-3 px-4 py-2.5 font-mono text-sm">
          <span className="shrink-0 text-muted-foreground/60">$</span>
          <code className="truncate text-foreground/85">{lang.install}</code>
          <button onClick={() => copy(lang.install)} aria-label="Copy install command" className="ml-1 shrink-0 text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
            {copied ? <Check className="h-4 w-4 text-foreground" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <span className="shrink-0 self-start rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground sm:self-auto">{lang.reg}</span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
          <span className="font-mono text-xs text-muted-foreground">{lang.file}</span>
          <span className="font-mono text-[11px] text-muted-foreground/70">PAdES-B-LT</span>
        </div>
        <div className="shiki-block overflow-x-auto p-4 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: lang.codeHtml }} />
      </div>
    </div>
  );
}
