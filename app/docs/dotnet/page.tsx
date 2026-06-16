import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'ATick for .NET · .NET', description: 'Get started with ATick — standalone PDF digital signatures for .NET: PAdES/CMS, RFC-3161 timestamps, LTV and an Adobe-valid green-tick signature appearance.', alternates: { canonical: '/docs/dotnet/' } };

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="">
      <h1>ATick for .NET</h1>
      <p>Standalone PDF digital-signature library for .NET — PAdES &amp; CMS signing with a PFX/PEM
      file, deferred eSign/HSM/token signing, RFC-3161 timestamps, long-term validation and a
      green-tick appearance Adobe shows as valid. One NuGet package, .NET Framework 2.0 → latest.</p>
      <blockquote>Install: <code>dotnet add package ATick</code></blockquote>
      <h2>Sign in one call</h2>
      <Code lang="dotnet" file="Sign.cs" code={`using Aniketc068.ATick;

byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket Chaturvedi\\"," +
    "\\"reason\\":\\"Approved\\",\\"page\\":1,\\"rect\\":[300,55,575,175]," +
    "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");`} />
      <p><a href="/docs/dotnet/quickstart/">Quickstart →</a></p>
    </DocsShell>
  );
}
