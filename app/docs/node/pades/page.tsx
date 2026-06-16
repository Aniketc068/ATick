import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'PAdES levels · Node.js', description: 'PAdES levels, RFC-3161 timestamps, LTV (DSS) and PAdES-B-LTA document timestamps with ATick for Node.js.', alternates: { canonical: '/docs/node/pades/' } };

export default function Page() {
  return (
    <DocsShell lang="node" section="pades">
      <h1>PAdES levels</h1>
      <p>ATick produces all four PAdES baseline levels. Adobe Acrobat shows the level in the advanced
      signature properties.</p>
      <table>
        <thead><tr><th>Level</th><th>Options</th><th>What it adds</th></tr></thead>
        <tbody>
          <tr><td><strong>B-B</strong></td><td><code>pades: true</code></td><td>a PAdES (CAdES) signature with the ESS signing-certificate-v2 attribute</td></tr>
          <tr><td><strong>B-T</strong></td><td><code>+ timestamp: true</code></td><td>an RFC-3161 signature timestamp</td></tr>
          <tr><td><strong>B-LT</strong></td><td><code>+ ltv: true</code></td><td>the DSS: full chain + CRLs + OCSP responses + per-signature VRI</td></tr>
          <tr><td><strong>B-LTA</strong></td><td><code>+ lta: true</code></td><td>a document timestamp over the whole file</td></tr>
        </tbody>
      </table>
      <p>Options are passed as a JSON string built with <code>JSON.stringify</code>. Failures throw an
      <code>Error</code>.</p>
      <Code lang="node" file="pades-levels.js" code={`const atick = require("atick");
const fs = require("fs");

const pdf = fs.readFileSync("input.pdf");
const pfx = fs.readFileSync("signer.pfx");

// B-B
const bb = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  pades: true
}));

// B-T
const bt = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  pades: true,
  timestamp: true
}));

// B-LT
const blt = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  pades: true,
  timestamp: true,
  ltv: true
}));

// B-LTA
const blta = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  pades: true,
  timestamp: true,
  lta: true
}));

fs.writeFileSync("signed.pdf", blta);`} />
      <p>For <strong>B-LT</strong> and <strong>B-LTA</strong> ATick embeds the complete validation
      material (the signer chain, its CRLs and full <code>OCSPResponse</code>s, the OCSP responder
      certificates, a per-signature VRI, and the <code>/Extensions /ESIC</code> declaration) so Adobe
      reports <strong>&quot;PAdES Signature Level: B-LT&quot;</strong>.</p>
      <blockquote>Each level is cumulative: <code>lta: true</code> implies the document timestamp on top
      of B-LT validation material, so a B-LTA call typically sets <code>pades</code>,
      <code>timestamp</code>, <code>ltv</code>, and <code>lta</code> together.</blockquote>

      <h2>PAdES vs. plain CMS, and /M</h2>
      <ul>
        <li><code>pades: true</code> → SubFilter <code>ETSI.CAdES.detached</code>; the signature dictionary carries <code>/M</code> (signing time), which Adobe uses to classify the PAdES level.</li>
        <li><code>pades: false</code> → SubFilter <code>adbe.pkcs7.detached</code>, a plain PKCS#7 signature with <strong>no <code>/M</code></strong>.</li>
      </ul>

      <h2>Custom TSA</h2>
      <p>The timestamp authority is configurable. Set <code>tsa_url</code> to your RFC-3161 endpoint,
      and supply HTTP Basic credentials with <code>tsa_auth</code> (a <code>[&quot;user&quot;, &quot;pass&quot;]</code>
      pair) when the TSA requires them. <code>hash_algo</code> selects the digest
      (<code>&quot;sha256&quot;</code>, <code>&quot;sha384&quot;</code>, or <code>&quot;sha512&quot;</code>).</p>
      <Code lang="node" file="custom-tsa.js" code={`const atick = require("atick");
const fs = require("fs");

const pdf = fs.readFileSync("input.pdf");
const pfx = fs.readFileSync("signer.pfx");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  pades: true,
  timestamp: true,
  ltv: true,
  tsa_url: "https://tsa.example.com/tsr",
  tsa_auth: ["user", "pass"],
  hash_algo: "sha256"
}));`} />

      <h2>Document timestamp on an existing signature</h2>
      <p><code>atick.addDocTimestamp</code> adds an archive <code>DocTimeStamp</code> over the whole
      file, upgrading an already-signed PDF to <strong>B-LTA</strong>. It takes the same JSON options
      (for example <code>tsa_url</code> and <code>tsa_auth</code>) so the archive timestamp can use a
      custom TSA.</p>
      <Code lang="node" file="doc-timestamp.js" code={`const atick = require("atick");
const fs = require("fs");

const signedPdf = fs.readFileSync("signed.pdf");

const archived = atick.addDocTimestamp(signedPdf, JSON.stringify({
  tsa_url: "https://tsa.example.com/tsr"
}));

fs.writeFileSync("signed-lta.pdf", archived);`} />
      <blockquote>Call <code>atick.version()</code> to confirm the library build in use when reporting
      an issue.</blockquote>

      <p><a href="/docs/node/appearance/">Next page →</a></p>
    </DocsShell>
  );
}
