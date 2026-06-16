import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Certification & field locking · Java', description: 'DocMDP certification with ATick for Java — no-changes (certify=1), form-filling and annotation levels, field locking.', alternates: { canonical: '/docs/java/certification/' } };

export default function Page() {
  return (
    <DocsShell lang="java" section="certification">
      <h1>Certification &amp; field locking</h1>

      <h2>Certification (DocMDP)</h2>
      <p>A <strong>certifying</strong> signature declares which later changes are allowed. Pass the
      <code> certify</code> option to the first signature:</p>
      <Code lang="java" file="Certify.java" code={`import io.github.aniketc068.atick.Atick;
import java.nio.file.*;

byte[] pdf = Files.readAllBytes(Path.of("contract.pdf"));
byte[] pfx = Files.readAllBytes(Path.of("signer.pfx"));

// P=1 — no changes at all
byte[] out1 = Atick.signPfx(pdf, pfx, "{\\"password\\":\\"••••\\",\\"certify\\":1}");

// P=2 — form filling + signing
byte[] out2 = Atick.signPfx(pdf, pfx, "{\\"password\\":\\"••••\\",\\"certify\\":2}");

// P=3 — form filling + annotations
byte[] out3 = Atick.signPfx(pdf, pfx, "{\\"password\\":\\"••••\\",\\"certify\\":3}");`} />
      <p>Omit <code>certify</code> (or set it to <code>0</code>) to produce a normal, non-certifying
      approval signature.</p>
      <table>
        <thead>
          <tr><th>Level</th><th>Value</th><th>Allows</th></tr>
        </thead>
        <tbody>
          <tr><td><code>NONE</code></td><td>0</td><td>a normal approval signature (no certification)</td></tr>
          <tr><td><code>NO_CHANGES</code></td><td>1</td><td>nothing — any later change (incl. another signature, LTV, timestamp) breaks it</td></tr>
          <tr><td><code>FORM_FILLING</code></td><td>2</td><td>filling form fields + adding signatures</td></tr>
          <tr><td><code>FORM_FILLING + ANNOTATIONS</code></td><td>3</td><td>the above + annotations</td></tr>
        </tbody>
      </table>
      <blockquote><code>NO_CHANGES</code> (P=1) forbids <strong>everything</strong> afterwards — so it
      cannot be combined with later LTV, document timestamps, or extra approval signatures. Use it as
      a single, final signature. For a document that will gather more signatures, certify with
      <code> 2</code> (<code>FORM_FILLING</code>) or <code>3</code>
      (<code>FORM_FILLING + ANNOTATIONS</code>).</blockquote>

      <h2>Field locking (FieldMDP)</h2>
      <p>Lock specific form fields so they cannot be changed after signing — without certifying the
      whole document:</p>
      <Code lang="java" file="Lock.java" code={`// lock these fields only
byte[] locked = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"lock_fields\\":[\\"ApproverName\\"]}");

// lock ALL fields
byte[] lockedAll = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"lock_fields\\":[\\"*\\"]}");`} />
      <p>If a locked field is altered after signing, the signature is reported as invalid.</p>
      <p>You can also <strong>certify and lock</strong> in one signature — combine <code>certify</code>
      with <code>lock_fields</code>:</p>
      <Code lang="java" file="CertifyLock.java" code={`byte[] out = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"certify\\":1,\\"lock_fields\\":[\\"*\\"]}");`} />

      <h2>Pre-sign checks</h2>
      <p>Validate the signing certificate <strong>before</strong> signing. These checks run prior to
      producing any output, and signing is <strong>refused</strong> if a check fails — so an invalid
      certificate never produces a signature.</p>
      <table>
        <thead>
          <tr><th>Option</th><th>Effect</th></tr>
        </thead>
        <tbody>
          <tr><td><code>verify</code></td><td>run the full set of certificate checks below</td></tr>
          <tr><td><code>verify_expiry</code></td><td>certificate must not be expired (or not yet valid)</td></tr>
          <tr><td><code>verify_crl</code></td><td>certificate must not be revoked per its CRL</td></tr>
          <tr><td><code>verify_ocsp</code></td><td>certificate must not be revoked per OCSP</td></tr>
          <tr><td><code>trusted_roots</code></td><td>extra trusted roots (a base64-encoded DER certificate list) the chain may reach for the checks above</td></tr>
        </tbody>
      </table>
      <p>The granular keys mirror the umbrella <code>verify</code> flag, so you can run just one
      check: <code>verify_expiry</code> refuses to sign an expired (or not-yet-valid) certificate,
      <code> verify_crl</code> runs a pre-sign CRL revocation check, and <code>verify_ocsp</code>
      runs a pre-sign OCSP revocation check. Supply <code>trusted_roots</code> as a list of
      base64-encoded DER certificates to add extra roots the chain is allowed to terminate at.</p>
      <Code lang="java" file="Verify.java" code={`byte[] out = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\"," +
    "\\"verify\\":true," +                                       // not expired + CRL + OCSP + not revoked
    "\\"trusted_roots\\":[\\"<base64 DER>\\",\\"<base64 DER>\\"]}"); // extra roots the chain may reach`} />
      <p>You can also enable the individual checks instead of the umbrella <code>verify</code>
      flag:</p>
      <Code lang="java" file="VerifyEach.java" code={`byte[] out = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\"," +
    "\\"verify_expiry\\":true," +
    "\\"verify_crl\\":true," +
    "\\"verify_ocsp\\":true}");`} />
      <p>Because a failed pre-sign check refuses to sign, it surfaces as an
      <code> Atick.AtickException</code>. Wrap the call in a try/catch so a revoked or expired
      certificate is handled instead of crashing:</p>
      <Code lang="java" file="VerifyCatch.java" code={`import io.github.aniketc068.atick.Atick;
import java.nio.file.*;

try {
    byte[] out = Atick.signPfx(pdf, pfx,
        "{\\"password\\":\\"••••\\"," +
        "\\"verify\\":true," +
        "\\"trusted_roots\\":[\\"<base64 DER>\\"]}");
    Files.write(Path.of("signed.pdf"), out);
} catch (Atick.AtickException e) {
    // certificate expired, revoked (CRL/OCSP), or chain did not reach a trusted root —
    // nothing was signed
    System.err.println("Signing refused: " + e.getMessage());
}`} />
      <blockquote><code>verify_crl</code> and <code>verify_ocsp</code> reach out to the CA&apos;s
      revocation endpoints (discovered from the certificate). If those endpoints are unreachable the
      check cannot complete and signing is refused — keep the catch block above in place.</blockquote>

      <p><a href="/docs/java/esign/">Next page →</a></p>
    </DocsShell>
  );
}
