import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Quickstart · .NET', description: 'Sign your first PDF with ATick for .NET in a few lines — PAdES signature, timestamp and an Adobe-valid green-tick appearance.', alternates: { canonical: '/docs/dotnet/quickstart/' } };

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="quickstart">
      <h1>Quickstart</h1>
      <p>Sign a PDF with a <code>.pfx</code> (or <code>.p12</code> / <code>.pem</code>) and a
      visible green-tick appearance.</p>

      <Code lang="dotnet" file="Quickstart.cs" code={`using System.IO;
using Aniketc068.ATick;

byte[] pdf = File.ReadAllBytes("doc.pdf");
byte[] pfx = File.ReadAllBytes("my.pfx");

byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Approved\\"," +
    "\\"green_tick\\":true,\\"page\\":1,\\"rect\\":[300,55,575,175]," +
    "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");   // PAdES-B-LT

File.WriteAllBytes("signed.pdf", signed);`} />

      <p>Open <code>signed.pdf</code> in Adobe Reader — for a trusted certificate it shows a valid
      green tick and <strong>&ldquo;Signed and all signatures are valid.&rdquo;</strong></p>

      <h2>What the options mean</h2>
      <table>
        <thead>
          <tr><th>Option</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>password</code></td><td>the PFX/P12 password (use <code>&quot;&quot;</code> for a PEM file)</td></tr>
          <tr><td><code>cn</code></td><td>the signer name shown in the appearance</td></tr>
          <tr><td><code>reason</code></td><td>the reason recorded in the signature</td></tr>
          <tr><td><code>green_tick</code></td><td>draw the verified mark Adobe greens for a valid+trusted certificate</td></tr>
          <tr><td><code>page</code>, <code>rect</code></td><td>where to draw the appearance — page number and <code>[x1,y1,x2,y2]</code> (PDF points)</td></tr>
          <tr><td><code>pades</code></td><td>produce a PAdES (ETSI) signature</td></tr>
          <tr><td><code>timestamp</code></td><td>add an RFC-3161 timestamp (PAdES-B-T)</td></tr>
          <tr><td><code>ltv</code></td><td>embed the chain + revocation for long-term validation (PAdES-B-LT)</td></tr>
        </tbody>
      </table>

      <h2>A minimal, invisible signature</h2>
      <Code lang="dotnet" file="Invisible.cs" code={`byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"placements\\":[],\\"pades\\":true}");   // valid, nothing drawn`} />

      <h2>Catching errors</h2>
      <Code lang="dotnet" file="Errors.cs" code={`try
{
    Atick.SignPfx(pdf, pfx, "{\\"password\\":\\"wrong\\"}");
}
catch (AtickException e)
{
    Console.WriteLine("signing failed: " + e.Message);
}`} />

      <p>Next: see Signing for all the options, or the API reference.</p>

      <p><a href="/docs/dotnet/install/">Next page →</a></p>
    </DocsShell>
  );
}
