import { highlight } from "@/lib/highlight";

// Server component: VS Code-coloured code block. Use in docs/server pages.
export async function Code({ code, lang, file }: { code: string; lang: string; file?: string }) {
  const html = await highlight(code, lang);
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-black/50">
      {file && (
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">{file}</span>
        </div>
      )}
      <div className="shiki-block overflow-x-auto p-4 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
