import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Signing methods · PHP', description: 'Sign PDFs with ATick for PHP — PFX/PKCS#12, PKCS#11 tokens / HSM, Windows store, single and multi-placement signatures.', alternates: { canonical: '/docs/php/signing/' } };

export default function Page() {
  return (
    <DocsShell lang="php" section="signing">
      <h1>Signing methods</h1>
      <p>ATick for PHP signs with a credential file or with an external key holder (USB token,
      smart-card, HSM, OS certificate store, or a remote eSign service). Every signing call takes its
      configuration as a single <strong>options array</strong> (or a JSON string), and every failure throws an
      <code> Aniketc068\ATick\AtickException</code>.</p>
      <Code lang="php" file="sign.php" code={`require 'vendor/autoload.php';
use Aniketc068\\ATick\\Atick;`} />
      <blockquote>ATick for PHP runs server-side. All inputs and outputs are PHP binary <strong>strings</strong> — read and write
      them with <code>file_get_contents</code> / <code>file_put_contents</code>. The options argument is a PHP associative
      <strong> array</strong> (preferred) or a JSON string.</blockquote>

      <h2>1. PFX / P12 / PEM file</h2>
      <p><code>Atick::signPfx</code> is the primary method. It accepts both <strong>PKCS#12</strong> (<code>.pfx</code> / <code>.p12</code>) and <strong>PEM</strong> —
      the format is auto-detected.</p>
      <Code lang="php" file="sign.php" code={`$pdf = file_get_contents("in.pdf");
$pfx = file_get_contents("signer.pfx");

$signed = Atick::signPfx($pdf, $pfx, [
    "password" => "••••",
    "cn"       => "Axonate Tech",
    "reason"   => "Approved",
    "pades"    => true,
]);

file_put_contents("out.pdf", $signed);`} />

      <h3>PEM credentials</h3>
      <p>A PEM credential is an unencrypted PKCS#8 / PKCS#1 private key plus one or more <code>CERTIFICATE</code>
      blocks. Pass its bytes as the <code>$pfx</code> argument and use an empty <code>password</code> (<code>&quot;&quot;</code>):</p>
      <Code lang="php" file="sign.php" code={`$pem = file_get_contents("signer.pem");

$signed = Atick::signPfx($pdf, $pem, [
    "password" => "",
    "cn"       => "Axonate Tech",
    "pades"    => true,
]);`} />
      <blockquote>Because the format is auto-detected, the same <code>signPfx</code> call works for <code>.pfx</code>, <code>.p12</code>, and <code>.pem</code>.
      Only the <code>password</code> differs: the PKCS#12 passphrase for <code>.pfx</code>/<code>.p12</code>, and <code>&quot;&quot;</code> for PEM.</blockquote>

      <h2>2. USB token / smart-card / HSM / OS store / eSign (deferred flow)</h2>
      <p>ATick for PHP does not load PKCS#11 libraries, the OS certificate store, or a remote eSign
      service itself. To sign with a key that never leaves a token, card, HSM, OS store, or eSign ESP,
      use the <strong>deferred flow</strong>: ATick prepares the document and hands you the exact bytes to sign, you
      produce the CMS signature with your own signer, and ATick embeds it.</p>
      <Code lang="php" file="deferred.php" code={`// Step 1 — prepare. Returns [$prepared, $bytesToSign].
[$prepared, $bytesToSign] = Atick::prepare($pdf, [
    "cn"        => "Axonate Tech",
    "reason"    => "Approved",
    "pades"     => true,
    "hash_algo" => "sha256",
]);

// Step 2 — produce a CMS signature with your own signer.
//   Sign $bytesToSign using the token / smart-card / HSM / OS-store / eSign key.
//   This is your own code (PKCS#11 binding, OS store, or a remote eSign ESP).
$cms = signWithMySigner($bytesToSign);   // returns a CMS/PKCS#7 SignedData binary string

// Step 3 — embed the CMS into the prepared document.
$signed = Atick::embed($prepared, $cms);
file_put_contents("out.pdf", $signed);`} />
      <blockquote>The CMS you build in step 2 must cover <strong><code>$bytesToSign</code></strong> exactly and use the same <code>hash_algo</code> you
      passed to <code>Atick::prepare</code>. This is the standard eSign / detached-signature pattern: ATick owns the
      PDF structure, your signer owns the private key.</blockquote>
      <p>If you have the key material in software (a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code>), ATick can also build the CMS for
      you with <code>Atick::cmsPfx</code>, then <code>Atick::embed</code>:</p>
      <Code lang="php" file="deferred.php" code={`[$prepared, $bytesToSign] = Atick::prepare($pdf, [
    "cn"    => "Axonate Tech",
    "pades" => true,
]);

$cms = Atick::cmsPfx($bytesToSign, $pfx, [
    "password" => "••••",
    "pades"    => true,
]);

$signed = Atick::embed($prepared, $cms);`} />

      <h2>Common options</h2>
      <p>All signing calls (<code>signPfx</code>, <code>prepare</code> / <code>cmsPfx</code>, <code>signField</code>) accept the same option keys.</p>
      <table>
        <thead>
          <tr><th>Key</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pades =&gt; true</code></td><td>PAdES (<code>ETSI.CAdES.detached</code>); <code>false</code> → plain CMS (<code>adbe.pkcs7.detached</code>)</td></tr>
          <tr><td><code>hash_algo =&gt; &quot;sha256&quot;</code></td><td><code>&quot;sha256&quot;</code>, <code>&quot;sha384&quot;</code>, <code>&quot;sha512&quot;</code></td></tr>
          <tr><td><code>timestamp =&gt; true</code></td><td>add an RFC-3161 signature timestamp (B-T)</td></tr>
          <tr><td><code>tsa_url =&gt; &quot;…&quot;</code>, <code>tsa_auth =&gt; [&quot;user&quot;, &quot;pass&quot;]</code></td><td>choose / authenticate the timestamp authority</td></tr>
          <tr><td><code>ltv =&gt; true</code></td><td>embed long-term validation (B-LT)</td></tr>
          <tr><td><code>lta =&gt; true</code></td><td>add a document timestamp (B-LTA)</td></tr>
          <tr><td><code>certify =&gt; 1</code>, <code>lock_fields =&gt; …</code></td><td>certification &amp; locking</td></tr>
          <tr><td><code>verify =&gt; true</code>, <code>verify_expiry</code>, <code>verify_crl</code>, <code>verify_ocsp</code></td><td>pre-sign expiry / CRL / OCSP / chain checks</td></tr>
          <tr><td><code>field_name =&gt; &quot;…&quot;</code></td><td>the signature field name (auto-uniquified — <code>Atick_1</code>, <code>Atick_2</code>, …)</td></tr>
          <tr><td><code>mode =&gt; &quot;single&quot; | &quot;shared&quot;</code></td><td>one signature on many pages, or many fields sharing one value</td></tr>
        </tbody>
      </table>
      <p><code>signPfx</code> additionally accepts <code>open_password</code> (decrypt an encrypted input), and
      <code> encrypt_password</code> / <code>owner_password</code> (password-protect the output).</p>

      <h3>Appearance options</h3>
      <p>The visible signature block is also configured through the same array: <code>cn</code>, <code>org</code>, <code>ou</code>,
      <code> location</code>, <code>reason</code>, <code>text</code>, <code>date</code>, <code>dn</code>, <code>body</code>, <code>heading</code>, <code>show_mark</code>, <code>green_tick</code>,
      <code> always_check</code>, <code>mark_color</code> (hex <code>&quot;#E53935&quot;</code>, name <code>&quot;blue&quot;</code>, or <code>[r, g, b]</code>), <code>mark_gradient</code>,
      <code> mark_scale</code>, <code>text_color</code>, <code>bg_color</code>, <code>border</code>, <code>font_size</code>, <code>width</code>, <code>height</code>, <code>page</code>,
      <code> rect</code> (<code>[x1, y1, x2, y2]</code>), and <code>placements</code> (<code>[[page, [x1, y1, x2, y2]], …]</code>).</p>
      <Code lang="php" file="sign.php" code={`$signed = Atick::signPfx($pdf, $pfx, [
    "password"   => "••••",
    "cn"         => "Axonate Tech",
    "reason"     => "Approved",
    "show_mark"  => true,
    "green_tick" => true,
    "mark_color" => "#E53935",
    "page"       => 1,
    "rect"       => [36, 36, 236, 96],
    "pades"      => true,
]);`} />

      <h2>Multi-signatory (sign an already-signed PDF)</h2>
      <p>ATick signs as an <strong>incremental update</strong>: existing signatures keep their byte ranges and stay
      valid. Just sign the already-signed PDF again — the field name is auto-uniquified so it never
      collides.</p>
      <Code lang="php" file="multi.php" code={`$v1 = Atick::signPfx($pdf, $pfx, [
    "password" => "••••",
    "cn"       => "Axonate Tech",
    "pades"    => true,
]); // Atick_1

$v2 = Atick::signPfx($v1, $pfx, [
    "password" => "••••",
    "cn"       => "Reviewer",
    "pades"    => true,
]); // Atick_2`} />
      <p>The same holds for the deferred flow: run <code>Atick::prepare</code> → external CMS → <code>Atick::embed</code> on the
      already-signed bytes to add another signature.</p>

      <p><a href="/docs/php/pades/">Next page →</a></p>
    </DocsShell>
  );
}
