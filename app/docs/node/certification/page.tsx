import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="node" section="certification">
      <h1>Certification &amp; field locking</h1>

      <h2>Certification (DocMDP)</h2>
      <p>A <strong>certifying</strong> signature declares which later changes are allowed. Pass the
      <code>certify</code> option to the first signature:</p>
      <Code lang="node" file="certify.js" code={`const atick = require("atick");
const fs = require("fs");

const pdf = fs.readFileSync("contract.pdf");
const pfx = fs.readFileSync("signer.pfx");

// P=1 — no changes at all
const out1 = atick.signPfx(pdf, pfx, JSON.stringify({ password: "••••", certify: 1 }));

// P=2 — form filling + signing
const out2 = atick.signPfx(pdf, pfx, JSON.stringify({ password: "••••", certify: 2 }));

// P=3 — form filling + annotations
const out3 = atick.signPfx(pdf, pfx, JSON.stringify({ password: "••••", certify: 3 }));`} />
      <p>Omit <code>certify</code> (or set it to <code>0</code>) to produce a normal, non-certifying
      approval signature.</p>
      <table>
        <thead><tr><th>Level</th><th>Value</th><th>Allows</th></tr></thead>
        <tbody>
          <tr><td><code>NONE</code></td><td>0</td><td>a normal approval signature (no certification)</td></tr>
          <tr><td><code>NO_CHANGES</code></td><td>1</td><td>nothing — any later change (incl. another signature, LTV, timestamp) breaks it</td></tr>
          <tr><td><code>FORM_FILLING</code></td><td>2</td><td>filling form fields + adding signatures</td></tr>
          <tr><td><code>FORM_FILLING + ANNOTATIONS</code></td><td>3</td><td>the above + annotations</td></tr>
        </tbody>
      </table>
      <blockquote><code>NO_CHANGES</code> (P=1) forbids <strong>everything</strong> afterwards — so it
      cannot be combined with later LTV, document timestamps, or extra approval signatures. Use it as a
      single, final signature. For a document that will gather more signatures, certify with
      <code>2</code> (<code>FORM_FILLING</code>) or <code>3</code> (<code>FORM_FILLING + ANNOTATIONS</code>).</blockquote>

      <h2>Field locking (FieldMDP)</h2>
      <p>Lock specific form fields so they cannot be changed after signing — without certifying the
      whole document:</p>
      <Code lang="node" file="lock.js" code={`// lock these fields only
const locked = atick.signPfx(pdf, pfx,
    JSON.stringify({ password: "••••", lock_fields: ["ApproverName"] }));

// lock ALL fields
const lockedAll = atick.signPfx(pdf, pfx,
    JSON.stringify({ password: "••••", lock_fields: ["*"] }));`} />
      <p>If a locked field is altered after signing, the signature is reported as invalid.</p>
      <p>You can also <strong>certify and lock</strong> in one signature — combine <code>certify</code>
      with <code>lock_fields</code>:</p>
      <Code lang="node" file="certify-lock.js" code={`const out = atick.signPfx(pdf, pfx,
    JSON.stringify({ password: "••••", certify: 1, lock_fields: ["*"] }));`} />

      <h2>Pre-sign checks</h2>
      <p>Validate the signing certificate <strong>before</strong> signing. These checks run prior to
      producing any output, and signing is <strong>refused</strong> if a check fails — so an invalid
      certificate never produces a signature.</p>
      <table>
        <thead><tr><th>Option</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td><code>verify</code></td><td>run the full set of certificate checks below</td></tr>
          <tr><td><code>verify_expiry</code></td><td>certificate must not be expired (or not yet valid)</td></tr>
          <tr><td><code>verify_crl</code></td><td>certificate must not be revoked per its CRL</td></tr>
          <tr><td><code>verify_ocsp</code></td><td>certificate must not be revoked per OCSP</td></tr>
          <tr><td><code>trusted_roots</code></td><td>chain (built from AIA) must reach one of these pinned root SHA-1 hex strings</td></tr>
        </tbody>
      </table>
      <Code lang="node" file="verify.js" code={`const out = atick.signPfx(pdf, pfx, JSON.stringify({
    password: "••••",
    verify: true,                              // not expired + CRL + OCSP + not revoked
    trusted_roots: ["<root SHA-1>", "<another>"] // chain must reach one of these
}));`} />
      <p>You can also enable the individual checks instead of the umbrella <code>verify</code> flag:</p>
      <Code lang="node" file="verify-individual.js" code={`const out = atick.signPfx(pdf, pfx, JSON.stringify({
    password: "••••",
    verify_expiry: true,
    verify_crl: true,
    verify_ocsp: true
}));`} />
      <p>Because a failed pre-sign check refuses to sign, it throws an <code>Error</code>. Wrap the call
      in a try/catch so a revoked or expired certificate is handled instead of crashing:</p>
      <Code lang="node" file="verify-catch.js" code={`const atick = require("atick");
const fs = require("fs");

try {
    const out = atick.signPfx(pdf, pfx, JSON.stringify({
        password: "••••",
        verify: true,
        trusted_roots: ["<root SHA-1>"]
    }));
    fs.writeFileSync("signed.pdf", out);
} catch (err) {
    // certificate expired, revoked (CRL/OCSP), or chain did not reach a pinned root —
    // nothing was signed
    console.error("Signing refused: " + err.message);
}`} />
      <blockquote><code>verify_crl</code> and <code>verify_ocsp</code> reach out to the CA&apos;s
      revocation endpoints (discovered from the certificate). If those endpoints are unreachable the
      check cannot complete and signing is refused — keep the catch block above in place.</blockquote>

      <h2>Embedding revocation proof</h2>
      <p>The pre-sign checks above validate the certificate <em>at signing time</em>. To let a verifier
      confirm the signature <em>later</em> — after the CRL/OCSP endpoints may be gone — embed the
      revocation material in the signature itself. On <code>cmsPfx</code>, pass <code>revocation: true</code>
      to embed RevocationInfoArchival (the signer&apos;s CRL and OCSP responses) inside the CMS:</p>
      <Code lang="node" file="revocation.js" code={`const cms = atick.cmsPfx(bytesToSign, pfx, JSON.stringify({
    password: "••••",
    pades: true,
    revocation: true,   // embed RevocationInfoArchival in the CMS
}));
const signed = atick.embed(prepared, cms);

// add the DSS validation material for the timestamp chain (PAdES-B-LTA)
const lta = atick.addDocTimestamp(signed, JSON.stringify({ tsa_url: "http://timestamp.example/tsa" }));`} />
      <p>Then <code>addDocTimestamp</code> adds the DSS for the timestamp chain, completing a
      self-contained, long-term-verifiable document.</p>

      <p><a href="/docs/node/esign/">Next page →</a></p>
    </DocsShell>
  );
}
