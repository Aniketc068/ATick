import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AGPL_TEXT } from "@/lib/agpl-license";

export const metadata: Metadata = {
  title: "GNU AGPL-3.0 License",
  description:
    "The full text of the GNU Affero General Public License v3.0 under which ATick is free for personal, internal and open-source use.",
  alternates: { canonical: "/license/agpl/" },
};

export default function AgplPage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/license/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Licensing
          </Link>
          <p className="eyebrow mt-6">Free license</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">GNU AGPL-3.0</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            ATick is free under the GNU Affero General Public License v3.0 for personal, internal and
            open-source (AGPL) use. The complete, verbatim license text is below.
          </p>

          <div className="glass mt-10 overflow-hidden p-1">
            <pre className="max-h-none overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/30 p-6 font-mono text-[13px] leading-6 text-foreground/85">
{AGPL_TEXT}
            </pre>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Selling or shipping a commercial product built on ATick requires a{" "}
            <Link
              href="/license/"
              className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              paid commercial license
            </Link>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
