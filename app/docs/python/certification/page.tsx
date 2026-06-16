import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Certification & field locking · Python', description: 'DocMDP certification with ATick for Python — no-changes (certify=1), form-filling and annotation levels, field locking.', alternates: { canonical: '/docs/python/certification/' } };

export default function Page() {
  return (
    <DocsShell lang="python" section="certification">
      <h1>Certification &amp; field locking</h1>

      <h2>Certification (DocMDP)</h2>
      <p>A <strong>certifying</strong> signature declares which later changes are allowed. Use
      <code>certify=</code> on the first signature:</p>
      <Code lang="python" file="certify.py" code={`from atick import Certify

atick.sign_pfx(pdf, certify=Certify.NO_CHANGES, ...)               # P=1 - no changes at all
atick.sign_pfx(pdf, certify=Certify.FORM_FILLING, ...)             # P=2 - form filling + signing
atick.sign_pfx(pdf, certify=Certify.FORM_FILLING_ANNOTATIONS, ...) # P=3 - + annotations
atick.sign_pfx(pdf, certify=Certify.NONE, ...)                     # 0 - a normal (non-certifying) signature`} />

      <table>
        <thead>
          <tr><th>Level</th><th>Value</th><th>Allows</th></tr>
        </thead>
        <tbody>
          <tr><td><code>NONE</code></td><td>0</td><td>a normal approval signature (no certification)</td></tr>
          <tr><td><code>NO_CHANGES</code></td><td>1</td><td>nothing — any later change (incl. another signature, LTV, timestamp) breaks it</td></tr>
          <tr><td><code>FORM_FILLING</code></td><td>2</td><td>filling form fields + adding signatures</td></tr>
          <tr><td><code>FORM_FILLING_ANNOTATIONS</code></td><td>3</td><td>the above + annotations</td></tr>
        </tbody>
      </table>

      <blockquote><code>NO_CHANGES</code> (P=1) forbids <strong>everything</strong> afterwards — so
      it cannot be combined with later LTV, document timestamps, or extra approval signatures. Use it
      as a single, final signature. For a document that will gather more signatures, certify with
      <code>FORM_FILLING</code> / <code>FORM_FILLING_ANNOTATIONS</code>.</blockquote>

      <h2>Field locking (FieldMDP)</h2>
      <p>Lock specific form fields so they cannot be changed after signing — without certifying the
      whole document:</p>
      <Code lang="python" file="lock_fields.py" code={`atick.sign_pfx(pdf, lock_fields=["ApproverName"], ...)   # lock these fields
atick.sign_pfx(pdf, lock_fields=["*"], ...)              # lock ALL fields`} />

      <p>If a locked field is altered after signing, the signature is reported as invalid.</p>

      <h2>Pre-sign checks</h2>
      <p>Validate the signing certificate <strong>before</strong> signing:</p>
      <Code lang="python" file="presign_checks.py" code={`atick.sign_pfx(pdf, ...,
    verify=True,                                   # not expired + CRL + OCSP + not revoked
    trusted_roots=["<root SHA-1>", "<another>"],   # chain must reach one of these (built from AIA)
)`} />

      <h3>Granular checks</h3>
      <p>Instead of the all-in-one <code>verify=True</code> (which runs every check and refuses to
      sign on failure), you can switch on the individual checks:</p>
      <ul>
        <li><strong><code>verify_expiry=True</code></strong> — refuse to sign if the signing
        certificate has expired or is not yet valid.</li>
        <li><strong><code>verify_crl=True</code></strong> — pre-sign CRL revocation check (refuse if
        the certificate is revoked).</li>
        <li><strong><code>verify_ocsp=True</code></strong> — pre-sign OCSP revocation check.</li>
        <li><strong><code>trusted_roots=[der, ...]</code></strong> — extra trusted root certificates
        (DER bytes) used by the checks when building the chain.</li>
      </ul>
      <Code lang="python" file="presign_granular.py" code={`atick.sign_pfx(pdf, pfx, pw, style=..., placements=...,
    verify_expiry=True,    # refuse if expired / not yet valid
    verify_crl=True,       # refuse if revoked (CRL)
    verify_ocsp=True,      # refuse if revoked (OCSP)
)`} />
      <p>Any check that fails raises <code>atick.AtickError</code> before the document is touched.</p>

      <p><a href="/docs/python/esign/">Next page →</a></p>
    </DocsShell>
  );
}
