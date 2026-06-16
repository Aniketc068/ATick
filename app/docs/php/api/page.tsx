import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="php" section="api">
      <h1>API reference</h1>
      <p>All operations are <strong>static methods</strong> on the <code>Atick</code> class. Bootstrap it once:</p>
      <Code lang="php" file="api.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;`} />
      <p>Every method takes raw PHP binary strings for PDFs and certificates (read with <code>file_get_contents</code>,
      write the result with <code>file_put_contents</code>), and an options argument where applicable — a PHP
      associative array (preferred) or a JSON string. On any failure a method throws
      <code> Aniketc068\ATick\AtickException</code> (which extends <code>RuntimeException</code>); the message is available from
      <code> $e-&gt;getMessage()</code>.</p>
      <Code lang="php" file="api.php" code={`// prepare() returns a two-element array:
//   [$prepared, $bytesToSign]   — both PHP binary strings`} />
      <p>ATick runs server-side only. There is no browser build and no command-line interface.</p>

      <h2>Signing</h2>
      <Code lang="php" file="api.php" code={`Atick::signPfx(string $pdf, string $pfx, array|string $options = []): string`} />
      <p>Sign <code>$pdf</code> with a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code> credential (the format is auto-detected). For a PEM file pass
      the password as the empty string <code>&quot;&quot;</code> inside the options. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — the PDF to sign (binary string).</li>
        <li><strong>$pfx</strong> — the credential bytes (<code>.pfx</code>, <code>.p12</code>, or <code>.pem</code>) as a binary string.</li>
        <li><strong>$options</strong> — the options array (see the Options table). Pass the credential password
        as the <code>password</code> key; use <code>&quot;&quot;</code> for PEM.</li>
        <li><strong>returns</strong> — the signed PDF as a binary string.</li>
      </ul>
      <Code lang="php" file="api.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;
use Aniketc068\\ATick\\AtickException;

$pdf = file_get_contents("in.pdf");
$pfx = file_get_contents("signer.pfx");

$options = [
    "password"  => "secret",
    "cn"        => "Aniket Chaturvedi",
    "reason"    => "Approval",
    "page"      => 1,
    "rect"      => [40, 40, 240, 140],
    "pades"     => true,
    "timestamp" => true,
    "tsa_url"   => "http://timestamp.example/tsa",
];

try {
    $signed = Atick::signPfx($pdf, $pfx, $options);
    file_put_contents("signed.pdf", $signed);
} catch (AtickException $e) {
    fwrite(STDERR, "signing failed: " . $e->getMessage() . "\\n");
}`} />
      <Code lang="php" file="api.php" code={`Atick::signField(string $pdf, string $pfx, array|string $options = []): string`} />
      <p>Sign an existing empty signature field. Use the <code>field_name</code> option to select the field. Returns the
      signed PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — a PDF containing an empty signature field (see <code>prepareFields</code>).</li>
        <li><strong>$pfx</strong> — the credential bytes (binary string).</li>
        <li><strong>$options</strong> — must include <code>field_name</code>; same credential and signing keys as <code>signPfx</code>.</li>
        <li><strong>returns</strong> — the signed PDF as a binary string.</li>
      </ul>

      <h2>Deferred / remote-key signing</h2>
      <p>These three methods cover the deferred (eSign / HSM / remote-key) flow: prepare the PDF, sign the
      returned bytes elsewhere, then embed the resulting CMS.</p>
      <Code lang="php" file="api.php" code={`Atick::prepare(string $pdf, array|string $options = []): array  // -> [$prepared, $bytesToSign]`} />
      <p>Step 1 of deferred signing. Adds an empty signature field, the appearance, and the signature
      container, then returns the exact bytes that must be signed. Returns a two-element array:</p>
      <ul>
        <li><strong>$prepared</strong> — the <strong>prepared PDF</strong> (binary string).</li>
        <li><strong>$bytesToSign</strong> — the <strong>bytes to sign</strong> (binary string); hash and sign these with the remote key.</li>
      </ul>
      <p>For an eSign flow, the InputHash sent to the ASP is the SHA-256 of <code>$bytesToSign</code>:</p>
      <Code lang="php" file="api.php" code={`$inputHash = hash('sha256', $bytesToSign);`} />
      <ul>
        <li><strong>$pdf</strong> — the PDF to prepare (binary string).</li>
        <li><strong>$options</strong> — appearance and signing options (see the Options table).</li>
        <li><strong>returns</strong> — <code>[$prepared, $bytesToSign]</code>.</li>
      </ul>
      <Code lang="php" file="api.php" code={`Atick::cmsPfx(string $data, string $pfx, array|string $options = []): string`} />
      <p>Produce a detached PKCS#7 / CMS signature over <code>$data</code> using a PFX. Useful for producing the CMS that
      <code> embed</code> expects when the signing credential is a local PFX.</p>
      <ul>
        <li><strong>$data</strong> — the bytes to sign (typically <code>$bytesToSign</code> from <code>prepare</code>) as a binary string.</li>
        <li><strong>$pfx</strong> — the credential bytes (binary string).</li>
        <li><strong>$options</strong> — <code>password</code>, <code>hash_algo</code>, <code>pades</code>, <code>timestamp</code>, <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>revocation</code>.</li>
        <li><strong>returns</strong> — the detached CMS as a binary string.</li>
      </ul>
      <p>Set <code>&apos;revocation&apos; =&gt; true</code> to embed a <code>RevocationInfoArchival</code> attribute (the signer chain&apos;s
      CRL/OCSP responses) inside the CMS itself, so the signature carries its own revocation evidence:</p>
      <Code lang="php" file="api.php" code={`$cms = Atick::cmsPfx($bytesToSign, $pfx, [
    "password"   => "secret",
    "pades"      => true,
    "revocation" => true,   // embed RevocationInfoArchival in the CMS
]);`} />
      <Code lang="php" file="api.php" code={`Atick::embed(string $prepared, string $cms): string`} />
      <p>Embed a detached CMS / PKCS#7 into a prepared PDF. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>$prepared</strong> — the prepared PDF (<code>$prepared</code> from <code>prepare</code>) as a binary string.</li>
        <li><strong>$cms</strong> — the detached CMS (from <code>cmsPfx</code>, an eSign reply, or an HSM) as a binary string.</li>
        <li><strong>returns</strong> — the signed PDF as a binary string.</li>
      </ul>
      <Code lang="php" file="api.php" code={`[$prepared, $bytesToSign] = Atick::prepare($pdf, $options);

$cms    = Atick::cmsPfx($bytesToSign, $pfx, ["password" => "secret"]);
$signed = Atick::embed($prepared, $cms);`} />

      <h2>Field templates</h2>
      <Code lang="php" file="api.php" code={`Atick::prepareFields(string $pdf, array|string $options = []): string`} />
      <p>Create an empty signature field as a template: the appearance is drawn, but the signature is left
      empty so it can be signed later with <code>signField</code>. Returns the PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — the PDF to add the field to (binary string).</li>
        <li><strong>$options</strong> — appearance options plus <code>field_name</code>, <code>page</code>, <code>rect</code> / <code>placements</code>.</li>
        <li><strong>returns</strong> — the PDF with an empty field as a binary string.</li>
      </ul>

      <h2>Long-term validation &amp; timestamps</h2>
      <Code lang="php" file="api.php" code={`Atick::addDocTimestamp(string $pdf, array|string $options = []): string`} />
      <p>Add an archive DocTimeStamp (and the DSS validation material) to an already-signed PDF, producing a
      PAdES-B-LTA document. Returns the timestamped PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — an already-signed PDF (binary string).</li>
        <li><strong>$options</strong> — <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>contents_size</code>.</li>
        <li><strong>returns</strong> — the timestamped PDF as a binary string.</li>
      </ul>
      <p>This also writes the DSS (Document Security Store) for the timestamp&apos;s own certificate chain, so the
      TSA chain is validatable long after signing. Pair it with a <code>&apos;revocation&apos; =&gt; true</code> CMS to carry
      revocation evidence end-to-end:</p>
      <Code lang="php" file="api.php" code={`// CMS carries its own revocation info; the doc timestamp adds the DSS for the timestamp chain
$cms      = Atick::cmsPfx($bytesToSign, $pfx, ["password" => "secret", "pades" => true, "revocation" => true]);
$signed   = Atick::embed($prepared, $cms);
$archived = Atick::addDocTimestamp($signed, ["tsa_url" => "http://timestamp.example/tsa", "ltv" => true]);`} />

      <h2>Documents &amp; utilities</h2>
      <Code lang="php" file="api.php" code={`Atick::setMetadata(string $pdf, array|string $options = []): string`} />
      <p>Set the document information (<code>/Info</code>) metadata on a PDF. Returns the updated PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — the PDF to update (binary string).</li>
        <li><strong>$options</strong> — <code>title</code>, <code>author</code>, <code>subject</code>, <code>keywords</code>, <code>application</code>, <code>created</code>, <code>modified</code>
        (see the Metadata options table).</li>
        <li><strong>returns</strong> — the updated PDF as a binary string.</li>
      </ul>
      <Code lang="php" file="api.php" code={`Atick::decrypt(string $pdf, string $password): string`} />
      <p>Decrypt a password-protected PDF. Returns the plaintext PDF bytes.</p>
      <ul>
        <li><strong>$pdf</strong> — the encrypted PDF (binary string).</li>
        <li><strong>$password</strong> — the open (user) password as a string.</li>
        <li><strong>returns</strong> — the decrypted PDF as a binary string.</li>
      </ul>
      <Code lang="php" file="api.php" code={`Atick::setFastSigning(bool $on): void`} />
      <p>Enable or disable the in-memory revocation cache (used to speed up repeated CRL/OCSP lookups).
      Passing <code>false</code> disables it.</p>
      <ul>
        <li><strong>$on</strong> — <code>true</code> to enable the cache, <code>false</code> to disable it.</li>
      </ul>
      <Code lang="php" file="api.php" code={`Atick::version(): string`} />
      <p>Return the engine version string.</p>
      <ul>
        <li><strong>returns</strong> — the version as a string.</li>
      </ul>
      <Code lang="php" file="api.php" code={`echo "ATick " . Atick::version();`} />

      <h2>Options</h2>
      <p>The <code>$options</code> argument is a PHP associative array (preferred) or a JSON string built with
      <code> json_encode([...])</code>. All keys are optional unless a method note says otherwise. Keys are grouped
      below by purpose.</p>

      <h3>Identity &amp; appearance text</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>cn</code></td><td>string</td><td>Common name shown in the appearance.</td></tr>
          <tr><td><code>org</code></td><td>string</td><td>Organisation line.</td></tr>
          <tr><td><code>ou</code></td><td>string</td><td>Organisational unit line.</td></tr>
          <tr><td><code>location</code></td><td>string</td><td>Signing location, also written to the signature.</td></tr>
          <tr><td><code>reason</code></td><td>string</td><td>Reason for signing, also written to the signature.</td></tr>
          <tr><td><code>text</code></td><td>string</td><td>Free text shown in the appearance.</td></tr>
          <tr><td><code>date</code></td><td>string</td><td>Date string shown in the appearance.</td></tr>
          <tr><td><code>dn</code></td><td>string</td><td>Full distinguished name line.</td></tr>
          <tr><td><code>body</code></td><td>string</td><td>Custom-text-only appearance body (<code>\n</code> = new line, <code>*x*</code> = bold).</td></tr>
          <tr><td><code>heading</code></td><td>string</td><td>Heading line above the signature details.</td></tr>
        </tbody>
      </table>

      <h3>Verified mark</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>show_mark</code></td><td>bool</td><td>Draw the verified mark.</td></tr>
          <tr><td><code>green_tick</code></td><td>bool</td><td>Use the &quot;?&quot; verified mark.</td></tr>
          <tr><td><code>always_check</code></td><td>bool</td><td>Always draw the verified/checked mark.</td></tr>
          <tr><td><code>mark_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Colour of the mark.</td></tr>
          <tr><td><code>mark_gradient</code></td><td>array of colours</td><td>Gradient fill for the mark.</td></tr>
          <tr><td><code>mark_scale</code></td><td>number</td><td>Scale factor for the mark size.</td></tr>
          <tr><td><code>mark_dx</code></td><td>number</td><td>Nudge the mark horizontally (PDF points; negative = left).</td></tr>
          <tr><td><code>mark_dy</code></td><td>number</td><td>Nudge the mark vertically (PDF points; negative = up).</td></tr>
        </tbody>
      </table>

      <h3>Layout &amp; styling</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>text_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Text colour.</td></tr>
          <tr><td><code>bg_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Background colour of the appearance.</td></tr>
          <tr><td><code>border</code></td><td>bool</td><td>Draw a border around the appearance.</td></tr>
          <tr><td><code>border_color</code></td><td><code>[r, g, b]</code></td><td>Border colour (with <code>border =&gt; true</code>).</td></tr>
          <tr><td><code>border_width</code></td><td>number</td><td>Border line width in PDF points (default <code>1.0</code>).</td></tr>
          <tr><td><code>font_size</code></td><td>number</td><td>Font size of the appearance text.</td></tr>
          <tr><td><code>width</code></td><td>number</td><td>Appearance width.</td></tr>
          <tr><td><code>height</code></td><td>number</td><td>Appearance height.</td></tr>
          <tr><td><code>top_reserve</code></td><td>number (0–1)</td><td>Fraction of the box height reserved at the top for the logo / mark.</td></tr>
          <tr><td><code>text_dx</code></td><td>number</td><td>Nudge the signer text horizontally (PDF points).</td></tr>
          <tr><td><code>text_top</code></td><td>number</td><td>Vertical start of the text block (fraction of box height).</td></tr>
        </tbody>
      </table>

      <h3>Placement</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>page</code></td><td>int</td><td>Page number for the signature (1-based).</td></tr>
          <tr><td><code>rect</code></td><td><code>[x1, y1, x2, y2]</code></td><td>Rectangle of the appearance on <code>page</code>.</td></tr>
          <tr><td><code>placements</code></td><td><code>[[page, [x1, y1, x2, y2]], ...]</code></td><td>Multiple appearance placements (one signature, several pages).</td></tr>
          <tr><td><code>mode</code></td><td><code>&quot;single&quot;</code> | <code>&quot;shared&quot;</code></td><td>Whether placements share one signature (<code>&quot;single&quot;</code>) or are separate.</td></tr>
          <tr><td><code>field_name</code></td><td>string</td><td>Name of the signature field.</td></tr>
        </tbody>
      </table>

      <h3>Cryptography &amp; PAdES</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>pades</code></td><td>bool</td><td>Produce a PAdES signature.</td></tr>
          <tr><td><code>hash_algo</code></td><td><code>&quot;sha256&quot;</code> | <code>&quot;sha384&quot;</code> | <code>&quot;sha512&quot;</code></td><td>Digest algorithm.</td></tr>
          <tr><td><code>timestamp</code></td><td>bool</td><td>Add an RFC-3161 signature timestamp.</td></tr>
          <tr><td><code>tsa_url</code></td><td>string</td><td>Timestamp authority URL.</td></tr>
          <tr><td><code>tsa_auth</code></td><td><code>[&quot;user&quot;, &quot;pass&quot;]</code></td><td>Basic-auth credentials for the TSA.</td></tr>
          <tr><td><code>ltv</code></td><td>bool</td><td>Add long-term validation material (DSS).</td></tr>
          <tr><td><code>revocation</code></td><td>bool</td><td>Embed <code>RevocationInfoArchival</code> (CRL/OCSP) inside the CMS (used by <code>cmsPfx</code>).</td></tr>
          <tr><td><code>lta</code></td><td>bool</td><td>Add an archive DocTimeStamp (PAdES-B-LTA).</td></tr>
          <tr><td><code>contents_size</code></td><td>int</td><td>Size of the signature <code>/Contents</code> placeholder (default <code>16384</code>).</td></tr>
        </tbody>
      </table>

      <h3>Certification &amp; locking</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>certify</code></td><td>int</td><td>Certification level: <code>1</code> = no changes, <code>2</code> = form filling, <code>3</code> = form filling + annotations.</td></tr>
          <tr><td><code>lock_fields</code></td><td><code>[&quot;*&quot;]</code> or names</td><td>Fields to lock after signing (<code>[&quot;*&quot;]</code> = all).</td></tr>
        </tbody>
      </table>

      <h3>Verification</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>verify</code></td><td>bool</td><td>Verify the certificate before signing.</td></tr>
          <tr><td><code>verify_expiry</code></td><td>bool</td><td>Check certificate validity dates.</td></tr>
          <tr><td><code>verify_crl</code></td><td>bool</td><td>Check the CRL.</td></tr>
          <tr><td><code>verify_ocsp</code></td><td>bool</td><td>Check OCSP.</td></tr>
          <tr><td><code>trusted_roots</code></td><td><code>[&quot;&lt;sha-1&gt;&quot;, ...]</code></td><td>Extra pinned root SHA-1 hex strings the chain must reach.</td></tr>
        </tbody>
      </table>
      <p>These run before any output is produced; if a check fails, signing is refused and an
      <code> AtickException</code> is thrown (see the <a href="/docs/php/certification/">Certification</a> page).</p>
      <Code lang="php" file="api.php" code={`$signed = Atick::signPfx($pdf, $pfx, [
    "password"      => "secret",
    "verify_expiry" => true,                          // not expired / not yet valid
    "verify_crl"    => true,                           // CRL check
    "verify_ocsp"   => true,                           // OCSP check
    "trusted_roots" => ["<root SHA-1>", "<another>"],  // chain must reach one of these
]);`} />

      <h3>Document security</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>open_password</code></td><td>string</td><td>User/open password for the output PDF.</td></tr>
          <tr><td><code>encrypt_password</code></td><td>string</td><td>Password used to encrypt the output PDF.</td></tr>
          <tr><td><code>owner_password</code></td><td>string</td><td>Owner/permissions password for the output PDF.</td></tr>
        </tbody>
      </table>

      <h2>Metadata options</h2>
      <p>These keys apply to <code>setMetadata</code>.</p>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>title</code></td><td>string</td><td>Document title.</td></tr>
          <tr><td><code>author</code></td><td>string</td><td>Document author.</td></tr>
          <tr><td><code>subject</code></td><td>string</td><td>Document subject.</td></tr>
          <tr><td><code>keywords</code></td><td>string</td><td>Document keywords.</td></tr>
          <tr><td><code>application</code></td><td>string</td><td>Creating/producing application.</td></tr>
          <tr><td><code>created</code></td><td>string</td><td>Creation date.</td></tr>
          <tr><td><code>modified</code></td><td>string</td><td>Modification date.</td></tr>
        </tbody>
      </table>

      <h2>Errors</h2>
      <p>Every <code>Atick</code> method throws <code>Aniketc068\ATick\AtickException</code> (extends <code>RuntimeException</code>) on failure
      — bad password, malformed PDF, network error, invalid options, and so on. The error text is
      available from <code>$e-&gt;getMessage()</code>.</p>
      <Code lang="php" file="api.php" code={`use Aniketc068\\ATick\\AtickException;

try {
    $signed = Atick::signPfx($pdf, $pfx, $options);
} catch (AtickException $e) {
    fwrite(STDERR, "ATick error: " . $e->getMessage() . "\\n");
}`} />
    </DocsShell>
  );
}
