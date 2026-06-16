import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="signing">
      <h1>Signing methods</h1>
      <p>ATick for .NET signs with a credential file or with an external key holder (USB token,
      smart-card, HSM, Windows certificate store). Every signing call takes its configuration as a
      single <strong>JSON options string</strong>, and every failure throws <code>AtickException</code>.</p>

      <Code lang="dotnet" file="Usings.cs" code={`using Aniketc068.ATick;
using System.IO;`} />

      <h2>1. PFX / P12 / PEM file</h2>
      <p><code>Atick.SignPfx</code> is the primary method. It accepts both <strong>PKCS#12</strong>
      (<code>.pfx</code> / <code>.p12</code>) and <strong>PEM</strong> — the format is auto-detected.</p>

      <Code lang="dotnet" file="SignPfx.cs" code={`byte[] pdf = File.ReadAllBytes("in.pdf");
byte[] pfx = File.ReadAllBytes("signer.pfx");

byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket\\",\\"reason\\":\\"Approved\\",\\"pades\\":true}");

File.WriteAllBytes("out.pdf", signed);`} />

      <h3>PEM credentials</h3>
      <p>A PEM credential is an unencrypted PKCS#8 / PKCS#1 private key plus one or more
      <code>CERTIFICATE</code> blocks. Pass its bytes as the <code>pfx</code> argument and use an
      empty <code>password</code> (<code>&quot;&quot;</code>):</p>

      <Code lang="dotnet" file="SignPem.cs" code={`byte[] pem = File.ReadAllBytes("signer.pem");

byte[] signed = Atick.SignPfx(pdf, pem,
    "{\\"password\\":\\"\\",\\"cn\\":\\"Aniket\\",\\"pades\\":true}");`} />

      <blockquote>Because the format is auto-detected, the same <code>SignPfx</code> call works for
      <code>.pfx</code>, <code>.p12</code>, and <code>.pem</code>. Only the <code>password</code>
      differs: the PKCS#12 passphrase for <code>.pfx</code>/<code>.p12</code>, and
      <code>&quot;&quot;</code> for PEM.</blockquote>

      <h2>2. USB token / smart-card / HSM / Windows store (deferred flow)</h2>
      <p>ATick for .NET does not load PKCS#11 libraries or the Windows store itself. To sign with a
      key that never leaves a token, card, HSM, or the OS store, use the <strong>deferred flow</strong>:
      ATick prepares the document and hands you the exact bytes to sign, you produce the CMS
      signature with your own provider (for example <code>System.Security.Cryptography</code>, a
      PKCS#11 provider, or a vendor SDK), and ATick embeds it.</p>

      <Code lang="dotnet" file="Deferred.cs" code={`// Step 1 — prepare. Returns a value tuple (Prepared, BytesToSign).
var (prepared, bytesToSign) = Atick.Prepare(pdf,
    "{\\"cn\\":\\"Aniket\\",\\"reason\\":\\"Approved\\",\\"pades\\":true,\\"hash_algo\\":\\"sha256\\"}");

// Step 2 — produce a CMS signature with your own provider.
//   Sign bytesToSign using the token / smart-card / HSM / Windows-store key.
//   This is your own code (System.Security.Cryptography, a PKCS#11 provider, or a vendor SDK).
byte[] cms = SignWithMyProvider(bytesToSign);   // returns a CMS/PKCS#7 SignedData

// Step 3 — embed the CMS into the prepared document.
byte[] signed = Atick.Embed(prepared, cms);
File.WriteAllBytes("out.pdf", signed);`} />

      <blockquote>The CMS you build in step 2 must cover <strong><code>bytesToSign</code></strong>
      exactly and use the same <code>hash_algo</code> you passed to <code>Atick.Prepare</code>. This
      is the standard eSign / detached-signature pattern: ATick owns the PDF structure, your provider
      owns the private key.</blockquote>

      <p>If you have the key material in software (a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code>),
      ATick can also build the CMS for you with <code>Atick.CmsPfx</code>, then <code>Atick.Embed</code>:</p>

      <Code lang="dotnet" file="CmsPfx.cs" code={`var (prepared, bytesToSign) = Atick.Prepare(pdf, "{\\"cn\\":\\"Aniket\\",\\"pades\\":true}");
byte[] cms    = Atick.CmsPfx(bytesToSign, pfx, "{\\"password\\":\\"••••\\",\\"pades\\":true}");
byte[] signed = Atick.Embed(prepared, cms);`} />

      <h2>Common options</h2>
      <p>All signing calls (<code>SignPfx</code>, <code>Prepare</code> / <code>CmsPfx</code>,
      <code>SignField</code>) accept the same JSON keys.</p>
      <table>
        <thead>
          <tr><th>Key</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>&quot;pades&quot;: true</code></td><td>PAdES (<code>ETSI.CAdES.detached</code>); <code>false</code> → plain CMS (<code>adbe.pkcs7.detached</code>)</td></tr>
          <tr><td><code>&quot;hash_algo&quot;: &quot;sha256&quot;</code></td><td><code>&quot;sha256&quot;</code>, <code>&quot;sha384&quot;</code>, <code>&quot;sha512&quot;</code></td></tr>
          <tr><td><code>&quot;timestamp&quot;: true</code></td><td>add an RFC-3161 signature timestamp (B-T)</td></tr>
          <tr><td><code>&quot;tsa_url&quot;</code>, <code>&quot;tsa_auth&quot;: [&quot;user&quot;,&quot;pass&quot;]</code></td><td>choose / authenticate the timestamp authority</td></tr>
          <tr><td><code>&quot;ltv&quot;: true</code></td><td>embed long-term validation (B-LT)</td></tr>
          <tr><td><code>&quot;lta&quot;: true</code></td><td>add a document timestamp (B-LTA)</td></tr>
          <tr><td><code>&quot;certify&quot;: 1</code>, <code>&quot;lock_fields&quot;: …</code></td><td>certification &amp; locking</td></tr>
          <tr><td><code>&quot;verify&quot;: true</code>, <code>&quot;verify_expiry&quot;</code>, <code>&quot;verify_crl&quot;</code>, <code>&quot;verify_ocsp&quot;</code></td><td>pre-sign expiry / CRL / OCSP / chain checks</td></tr>
          <tr><td><code>&quot;field_name&quot;: &quot;…&quot;</code></td><td>the signature field name (auto-uniquified — <code>Atick_1</code>, <code>Atick_2</code>, …)</td></tr>
          <tr><td><code>&quot;mode&quot;: &quot;single&quot; | &quot;shared&quot;</code></td><td>one signature on many pages, or many fields sharing one value</td></tr>
        </tbody>
      </table>

      <p><code>SignPfx</code> additionally accepts <code>&quot;open_password&quot;</code> (decrypt an
      encrypted input), and <code>&quot;encrypt_password&quot;</code> / <code>&quot;owner_password&quot;</code>
      (password-protect the output).</p>

      <h3>Appearance options</h3>
      <p>The visible signature block is also configured through the same JSON: <code>cn</code>,
      <code>org</code>, <code>ou</code>, <code>location</code>, <code>reason</code>, <code>text</code>,
      <code>date</code>, <code>dn</code>, <code>body</code>, <code>heading</code>, <code>show_mark</code>,
      <code>green_tick</code>, <code>always_check</code>, <code>mark_color</code> (hex
      <code>&quot;#E53935&quot;</code>, name <code>&quot;blue&quot;</code>, or <code>[r,g,b]</code>),
      <code>mark_gradient</code>, <code>mark_scale</code>, <code>text_color</code>, <code>bg_color</code>,
      <code>border</code>, <code>font_size</code>, <code>width</code>, <code>height</code>,
      <code>page</code>, <code>rect</code> (<code>[x1,y1,x2,y2]</code>), and <code>placements</code>
      (<code>[[page,[x1,y1,x2,y2]], …]</code>).</p>

      <Code lang="dotnet" file="Appearance.cs" code={`byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket\\",\\"reason\\":\\"Approved\\","
  + "\\"show_mark\\":true,\\"green_tick\\":true,\\"mark_color\\":\\"#E53935\\","
  + "\\"page\\":1,\\"rect\\":[36,36,236,96],\\"pades\\":true}");`} />

      <h2>Multi-signatory (sign an already-signed PDF)</h2>
      <p>ATick signs as an <strong>incremental update</strong>: existing signatures keep their byte
      ranges and stay valid. Just sign the already-signed PDF again — the field name is
      auto-uniquified so it never collides.</p>

      <Code lang="dotnet" file="MultiSign.cs" code={`byte[] v1 = Atick.SignPfx(pdf, pfx, "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket\\",\\"pades\\":true}");   // Atick_1
byte[] v2 = Atick.SignPfx(v1,  pfx, "{\\"password\\":\\"••••\\",\\"cn\\":\\"Reviewer\\",\\"pades\\":true}"); // Atick_2`} />

      <p>The same holds for the deferred flow: run <code>Atick.Prepare</code> → external CMS →
      <code>Atick.Embed</code> on the already-signed bytes to add another signature.</p>

      <p><a href="/docs/dotnet/pades/">Next page →</a></p>
    </DocsShell>
  );
}
