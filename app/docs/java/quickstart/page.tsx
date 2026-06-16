import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Quickstart · Java', description: 'Sign your first PDF with ATick for Java in a few lines — PAdES signature, timestamp and an Adobe-valid green-tick appearance.', alternates: { canonical: '/docs/java/quickstart/' } };

export default function Page() {
  return (
    <DocsShell lang="java" section="quickstart">
      <h1>Quickstart</h1>
      <p>Sign a PDF with a <code>.pfx</code> (or <code>.p12</code> / <code>.pem</code>) and a visible
      green-tick appearance.</p>
      <Code lang="java" file="Quickstart.java" code={`import io.github.aniketc068.atick.Atick;
import java.nio.file.*;

public class Quickstart {
    public static void main(String[] args) throws Exception {
        byte[] pdf = Files.readAllBytes(Paths.get("doc.pdf"));
        byte[] pfx = Files.readAllBytes(Paths.get("my.pfx"));

        byte[] signed = Atick.signPfx(pdf, pfx,
            "{\\"password\\":\\"••••\\",\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Approved\\","
          + "\\"green_tick\\":true,\\"page\\":1,\\"rect\\":[300,55,575,175],"
          + "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");   // PAdES-B-LT

        Files.write(Paths.get("signed.pdf"), signed);
    }
}`} />
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
          <tr><td><code>green_tick</code></td><td>draw the validity mark Adobe greens for a valid+trusted certificate</td></tr>
          <tr><td><code>page</code>, <code>rect</code></td><td>where to draw the appearance — page number and <code>[x1,y1,x2,y2]</code> (PDF points)</td></tr>
          <tr><td><code>pades</code></td><td>produce a PAdES (ETSI) signature</td></tr>
          <tr><td><code>timestamp</code></td><td>add an RFC-3161 timestamp (PAdES-B-T)</td></tr>
          <tr><td><code>ltv</code></td><td>embed the chain + revocation for long-term validation (PAdES-B-LT)</td></tr>
        </tbody>
      </table>

      <h2>A minimal, invisible signature</h2>
      <Code lang="java" file="Invisible.java" code={`byte[] signed = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"placements\\":[],\\"pades\\":true}");   // valid, nothing drawn`} />

      <h2>Catching errors</h2>
      <p>Every failure is a normal Java exception:</p>
      <Code lang="java" file="Errors.java" code={`try {
    Atick.signPfx(pdf, pfx, "{\\"password\\":\\"wrong\\"}");
} catch (Atick.AtickException e) {
    System.out.println("signing failed: " + e.getMessage());
}`} />

      <p>Next: see <a href="/docs/java/signing/">Signing</a> for all the signing options, or the
      <a href="/docs/java/api/"> API reference</a>.</p>

      <p><a href="/docs/java/install/">Next page →</a></p>
    </DocsShell>
  );
}
