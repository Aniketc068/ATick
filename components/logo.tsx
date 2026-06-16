import { cn } from "@/lib/utils";

// ATick wordmark — green tick + "ATick" in white. Transparent, rectangular, no box.
// Size it with a font-size utility (e.g. text-2xl); the tick scales with the text.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex select-none items-center gap-1.5 font-bold leading-none tracking-tight text-foreground", className)}>
      <svg viewBox="0 0 30 30" className="h-[0.95em] w-auto" fill="none" aria-hidden="true">
        <path
          d="M4 15.5 L11.5 23 L26 5"
          stroke="#22C55E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>ATick</span>
    </span>
  );
}
