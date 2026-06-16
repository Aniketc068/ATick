import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="node" section="signing">
      <h1>Signing methods</h1>
      <p>ATick for Node.js signs with a credential file or with an external key holder (USB token,
      smart-card, HSM, OS certificate store, or a remote eSign service). Every signing call takes its
      configuration as a single <strong>JSON options string</strong>, and every failure throws a
      normal <code>Error</code>.</p>
      <Code lang="node" file="require.js" code={`const atick = require("atick");
const fs = require("fs");`} />
      <blockquote>ATick for Node.js runs server-side. All inputs and outputs are Node
      <code>Buffer</code>s, and the options argument is a JSON <strong>string</strong> — build it with
      <code>JSON.stringify(&#123; ... &#125;)</code>.</blockquote>

      <h2>1. PFX / P12 / PEM file</h2>
      <p><code>atick.signPfx</code> is the primary method. It accepts both <strong>PKCS#12</strong>
      (<code>.pfx</code> / <code>.p12</code>) and <strong>PEM</strong> — the format is auto-detected.</p>
      <Code lang="node" file="signpfx.js" code={`const pdf = fs.readFileSync("in.pdf");
const pfx = fs.readFileSync("signer.pfx");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  cn: "Aniket",
  reason: "Approved",
  pades: true,
}));

fs.writeFileSync("out.pdf", signed);`} />

      <h3>PEM credentials</h3>
      <p>A PEM credential is an unencrypted PKCS#8 / PKCS#1 private key plus one or more
      <code>CERTIFICATE</code> blocks. Pass its bytes as the <code>pfx</code> argument and use an empty
      <code>password</code> (<code>&quot;&quot;</code>):</p>
      <Code lang="node" file="signpem.js" code={`const pem = fs.readFileSync("signer.pem");

const signed = atick.signPfx(pdf, pem, JSON.stringify({
  password: "",
  cn: "Aniket",
  pades: true,
}));`} />
      <blockquote>Because the format is auto-detected, the same <code>signPfx</code> call works for
      <code>.pfx</code>, <code>.p12</code>, and <code>.pem</code>. Only the <code>password</code>
      differs: the PKCS#12 passphrase for <code>.pfx</code>/<code>.p12</code>, and
      <code>&quot;&quot;</code> for PEM.</blockquote>

      <h2>2. USB token / smart-card / HSM / OS store / eSign (deferred flow)</h2>
      <p>ATick for Node.js does not load PKCS#11 libraries, the OS certificate store, or a remote eSign
      service itself. To sign with a key that never leaves a token, card, HSM, OS store, or eSign ESP,
      use the <strong>deferred flow</strong>: ATick prepares the document and hands you the exact bytes
      to sign, you produce the CMS signature with your own signer, and ATick embeds it.</p>
      <Code lang="node" file="deferred.js" code={`// Step 1 — prepare. Returns { prepared, bytesToSign }.
const { prepared, bytesToSign } = atick.prepare(pdf, JSON.stringify({
  cn: "Aniket",
  reason: "Approved",
  pades: true,
  hash_algo: "sha256",
}));

// Step 2 — produce a CMS signature with your own signer.
//   Sign \`bytesToSign\` using the token / smart-card / HSM / OS-store / eSign key.
//   This is your own code (PKCS#11 binding, OS store, or a remote eSign ESP).
const cms = await signWithMySigner(bytesToSign);   // returns a CMS/PKCS#7 SignedData Buffer

// Step 3 — embed the CMS into the prepared document.
const signed = atick.embed(prepared, cms);
fs.writeFileSync("out.pdf", signed);`} />
      <blockquote>The CMS you build in step 2 must cover <strong><code>bytesToSign</code></strong>
      exactly and use the same <code>hash_algo</code> you passed to <code>atick.prepare</code>. This is
      the standard eSign / detached-signature pattern: ATick owns the PDF structure, your signer owns
      the private key.</blockquote>

      <p>If you have the key material in software (a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code>),
      ATick can also build the CMS for you with <code>atick.cmsPfx</code>, then <code>atick.embed</code>:</p>
      <Code lang="node" file="cmspfx.js" code={`const { prepared, bytesToSign } = atick.prepare(pdf, JSON.stringify({
  cn: "Aniket",
  pades: true,
}));

const cms = atick.cmsPfx(bytesToSign, pfx, JSON.stringify({
  password: "••••",
  pades: true,
}));

const signed = atick.embed(prepared, cms);`} />

      <h2>Common options</h2>
      <p>All signing calls (<code>signPfx</code>, <code>prepare</code> / <code>cmsPfx</code>,
      <code>signField</code>) accept the same JSON keys.</p>
      <table>
        <thead><tr><th>Key</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>pades: true</code></td><td>PAdES (<code>ETSI.CAdES.detached</code>); <code>false</code> → plain CMS (<code>adbe.pkcs7.detached</code>)</td></tr>
          <tr><td><code>hash_algo: &quot;sha256&quot;</code></td><td><code>&quot;sha256&quot;</code>, <code>&quot;sha384&quot;</code>, <code>&quot;sha512&quot;</code></td></tr>
          <tr><td><code>timestamp: true</code></td><td>add an RFC-3161 signature timestamp (B-T)</td></tr>
          <tr><td><code>tsa_url</code>, <code>tsa_auth: [&quot;user&quot;, &quot;pass&quot;]</code></td><td>choose / authenticate the timestamp authority</td></tr>
          <tr><td><code>ltv: true</code></td><td>embed long-term validation (B-LT)</td></tr>
          <tr><td><code>lta: true</code></td><td>add a document timestamp (B-LTA)</td></tr>
          <tr><td><code>certify: 1</code>, <code>lock_fields</code></td><td>certification &amp; locking</td></tr>
          <tr><td><code>verify</code>, <code>verify_expiry</code>, <code>verify_crl</code>, <code>verify_ocsp</code></td><td>pre-sign expiry / CRL / OCSP / chain checks</td></tr>
          <tr><td><code>field_name</code></td><td>the signature field name (auto-uniquified — <code>Atick_1</code>, <code>Atick_2</code>, …)</td></tr>
          <tr><td><code>mode: &quot;single&quot; | &quot;shared&quot;</code></td><td>one signature on many pages, or many fields sharing one value</td></tr>
        </tbody>
      </table>
      <p><code>signPfx</code> additionally accepts <code>open_password</code> (decrypt an encrypted
      input), and <code>encrypt_password</code> / <code>owner_password</code> (password-protect the
      output).</p>

      <h3>Appearance options</h3>
      <p>The visible signature block is also configured through the same JSON: <code>cn</code>,
      <code>org</code>, <code>ou</code>, <code>location</code>, <code>reason</code>, <code>text</code>,
      <code>date</code>, <code>dn</code>, <code>body</code>, <code>heading</code>, <code>show_mark</code>,
      <code>green_tick</code>, <code>always_check</code>, <code>mark_color</code> (hex
      <code>&quot;#E53935&quot;</code>, name <code>&quot;blue&quot;</code>, or <code>[r, g, b]</code>),
      <code>mark_gradient</code>, <code>mark_scale</code>, <code>text_color</code>, <code>bg_color</code>,
      <code>border</code>, <code>font_size</code>, <code>width</code>, <code>height</code>,
      <code>page</code>, <code>rect</code> (<code>[x1, y1, x2, y2]</code>), and <code>placements</code>
      (<code>[[page, [x1, y1, x2, y2]], …]</code>).</p>
      <Code lang="node" file="appearance.js" code={`const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  cn: "Aniket",
  reason: "Approved",
  show_mark: true,
  green_tick: true,
  mark_color: "#E53935",
  page: 1,
  rect: [36, 36, 236, 96],
  pades: true,
}));`} />

      <h2>Multi-signatory (sign an already-signed PDF)</h2>
      <p>ATick signs as an <strong>incremental update</strong>: existing signatures keep their byte
      ranges and stay valid. Just sign the already-signed PDF again — the field name is auto-uniquified
      so it never collides.</p>
      <Code lang="node" file="multisig.js" code={`const v1 = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••",
  cn: "Aniket",
  pades: true,
})); // Atick_1

const v2 = atick.signPfx(v1, pfx, JSON.stringify({
  password: "••••",
  cn: "Reviewer",
  pades: true,
})); // Atick_2`} />
      <p>The same holds for the deferred flow: run <code>atick.prepare</code> → external CMS →
      <code>atick.embed</code> on the already-signed bytes to add another signature.</p>

      <p><a href="/docs/node/pades/">Next page →</a></p>
    </DocsShell>
  );
}
