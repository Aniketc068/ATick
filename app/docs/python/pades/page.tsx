import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'PAdES levels · Python', description: 'PAdES levels, RFC-3161 timestamps, LTV (DSS) and PAdES-B-LTA document timestamps with ATick for Python.', alternates: { canonical: '/docs/python/pades/' } };

export default function Page() {
  return (
    <DocsShell lang="python" section="pades">
      <h1>PAdES levels</h1>

      <p>ATick produces all four PAdES baseline levels. Adobe Acrobat shows the level in the advanced
      signature properties.</p>

      <table>
        <thead>
          <tr><th>Level</th><th>Call</th><th>What it adds</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>B-B</strong></td><td><code>pades=True</code></td><td>a PAdES (CAdES) signature with the ESS signing-certificate-v2 attribute</td></tr>
          <tr><td><strong>B-T</strong></td><td><code>+ timestamp=True</code></td><td>an RFC-3161 signature timestamp</td></tr>
          <tr><td><strong>B-LT</strong></td><td><code>+ ltv=True</code></td><td>the DSS: full chain + CRLs + OCSP responses + per-signature VRI</td></tr>
          <tr><td><strong>B-LTA</strong></td><td><code>+ lta=True</code></td><td>a document timestamp over the whole file</td></tr>
        </tbody>
      </table>

      <Code lang="python" file="pades_levels.py" code={`atick.sign_pfx(pdf, pfx=pfx, password=pw, style=style, placements=placements, pades=True)                  # B-B
atick.sign_pfx(pdf, pfx=pfx, password=pw, style=style, placements=placements, pades=True, timestamp=True)              # B-T
atick.sign_pfx(pdf, pfx=pfx, password=pw, style=style, placements=placements, pades=True, timestamp=True, ltv=True)    # B-LT
atick.sign_pfx(pdf, pfx=pfx, password=pw, style=style, placements=placements, pades=True, timestamp=True, lta=True)    # B-LTA`} />

      <p>For <strong>B-LT</strong> ATick embeds the complete validation material (the signer chain,
      its CRLs and full <code>OCSPResponse</code>s, the OCSP responder certificates, a per-signature
      VRI, and the <code>/Extensions /ESIC</code> declaration) so Adobe reports
      “PAdES Signature Level: B-LT”.</p>

      <h2>PAdES vs. plain CMS, and <code>/M</code></h2>
      <ul>
        <li><code>pades=True</code> → SubFilter <code>ETSI.CAdES.detached</code>; the signature
        dictionary carries <code>/M</code> (signing time), which Adobe uses to classify the PAdES
        level.</li>
        <li><code>pades=False</code> → SubFilter <code>adbe.pkcs7.detached</code>, a plain PKCS#7
        signature with <strong>no <code>/M</code></strong> (unless you pass
        <code>signing_time=</code>).</li>
      </ul>

      <h2>Document timestamp on an existing signature</h2>
      <Code lang="python" file="doctimestamp.py" code={`final = atick.add_doctimestamp(signed_pdf)     # archive timestamp over the whole document (B-LTA)`} />

      <p><a href="/docs/python/appearance/">Next page →</a></p>
    </DocsShell>
  );
}
