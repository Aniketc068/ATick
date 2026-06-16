import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="java" section="api">
      <h1>API reference</h1>
      <p>All operations are static methods on <code>io.github.aniketc068.atick.Atick</code>. Every
      method takes raw <code>byte[]</code> for PDFs and certificates, and an options JSON string where
      applicable. On any failure a method throws <code>Atick.AtickException</code> — a public static
      class extending <code>RuntimeException</code>. The error text is available from
      <code> e.getMessage()</code>.</p>
      <Code lang="java" file="Import.java" code={`import io.github.aniketc068.atick.Atick;`} />

      <h2>Signing</h2>
      <Code lang="java" file="SignPfx.java" code={`static byte[] signPfx(byte[] pdf, byte[] pfx, String optionsJson)`} />
      <p>Sign <code>pdf</code> with a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code> credential
      (the format is auto-detected). For a PEM file pass the password as the empty string
      <code> &quot;&quot;</code> inside the options. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to sign.</li>
        <li><strong>pfx</strong> — the credential bytes (<code>.pfx</code>, <code>.p12</code>, or <code>.pem</code>).</li>
        <li><strong>optionsJson</strong> — the options JSON (see the Options table). Pass the credential password as the <code>password</code> key; use <code>&quot;&quot;</code> for PEM.</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>
      <Code lang="java" file="SignExample.java" code={`import io.github.aniketc068.atick.Atick;

byte[] pdf = Files.readAllBytes(Path.of("in.pdf"));
byte[] pfx = Files.readAllBytes(Path.of("signer.pfx"));

String options = """
    {
      "password": "secret",
      "cn": "Aniket Chaturvedi",
      "reason": "Approval",
      "page": 1,
      "rect": [40, 40, 240, 140],
      "pades": true,
      "timestamp": true,
      "tsa_url": "http://timestamp.example/tsa"
    }
    """;

try {
    byte[] signed = Atick.signPfx(pdf, pfx, options);
    Files.write(Path.of("signed.pdf"), signed);
} catch (Atick.AtickException e) {
    System.err.println("signing failed: " + e.getMessage());
}`} />

      <Code lang="java" file="SignField.java" code={`static byte[] signField(byte[] pdf, byte[] pfx, String optionsJson)`} />
      <p>Sign an existing empty signature field. Use the <code>field_name</code> option to select the
      field. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — a PDF containing an empty signature field (see <code>prepareFields</code>).</li>
        <li><strong>pfx</strong> — the credential bytes.</li>
        <li><strong>optionsJson</strong> — must include <code>field_name</code>; same credential and signing keys as <code>signPfx</code>.</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>

      <h2>Deferred / remote-key signing</h2>
      <p>These three methods cover the deferred (eSign / HSM / remote-key) flow: prepare the PDF, sign
      the returned bytes elsewhere, then embed the resulting CMS.</p>
      <Code lang="java" file="Prepare.java" code={`static byte[][] prepare(byte[] pdf, String optionsJson)`} />
      <p>Step 1 of deferred signing. Adds an empty signature field, the appearance, and the signature
      container, then returns the exact bytes that must be signed. Returns a <code>byte[][]</code> of
      length 2:</p>
      <ul>
        <li>index <code>0</code> — the <strong>prepared PDF</strong> (<code>byte[]</code>).</li>
        <li>index <code>1</code> — the <strong>bytes to sign</strong> (<code>byte[]</code>); hash and sign these with the remote key.</li>
      </ul>
      <ul>
        <li><strong>pdf</strong> — the PDF to prepare.</li>
        <li><strong>optionsJson</strong> — appearance and signing options (see the Options table).</li>
        <li><strong>returns</strong> — <code>byte[][]{"{"} prepared, bytesToSign {"}"}</code>.</li>
      </ul>
      <Code lang="java" file="CmsPfx.java" code={`static byte[] cmsPfx(byte[] data, byte[] pfx, String optionsJson)`} />
      <p>Produce a detached PKCS#7 / CMS signature over <code>data</code> using a PFX. Useful for
      producing the CMS that <code>embed</code> expects when the signing credential is a local
      PFX.</p>
      <ul>
        <li><strong>data</strong> — the bytes to sign (typically index <code>1</code> from <code>prepare</code>).</li>
        <li><strong>pfx</strong> — the credential bytes.</li>
        <li><strong>optionsJson</strong> — <code>password</code>, <code>hash_algo</code>, <code>pades</code>, <code>timestamp</code>, <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>revocation</code>.</li>
        <li><strong>returns</strong> — the detached CMS as <code>byte[]</code>.</li>
      </ul>
      <p>Pass <code>&quot;revocation&quot;:true</code> to embed the <code>RevocationInfoArchival</code>
      attribute (the signer&apos;s CRL / OCSP responses) inside the produced CMS, so the signature
      carries its own revocation evidence.</p>
      <Code lang="java" file="Embed.java" code={`static byte[] embed(byte[] prepared, byte[] cms)`} />
      <p>Embed a detached CMS / PKCS#7 into a prepared PDF. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>prepared</strong> — the prepared PDF (index <code>0</code> from <code>prepare</code>).</li>
        <li><strong>cms</strong> — the detached CMS (from <code>cmsPfx</code>, an eSign reply, or an HSM).</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>
      <Code lang="java" file="DeferredExample.java" code={`import io.github.aniketc068.atick.Atick;

byte[][] step = Atick.prepare(pdf, options);
byte[] prepared    = step[0];
byte[] bytesToSign = step[1];

byte[] cms    = Atick.cmsPfx(bytesToSign, pfx, "{\\"password\\":\\"secret\\"}");
byte[] signed = Atick.embed(prepared, cms);`} />

      <h2>Field templates</h2>
      <Code lang="java" file="PrepareFields.java" code={`static byte[] prepareFields(byte[] pdf, String optionsJson)`} />
      <p>Create an empty signature field as a template: the appearance is drawn, but the signature is
      left empty so it can be signed later with <code>signField</code>. Returns the PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to add the field to.</li>
        <li><strong>optionsJson</strong> — appearance options plus <code>field_name</code>, <code>page</code>, <code>rect</code> / <code>placements</code>.</li>
        <li><strong>returns</strong> — the PDF with an empty field as <code>byte[]</code>.</li>
      </ul>

      <h2>Long-term validation &amp; timestamps</h2>
      <Code lang="java" file="AddDocTimestamp.java" code={`static byte[] addDocTimestamp(byte[] pdf, String optionsJson)`} />
      <p>Add an archive DocTimeStamp (and the DSS validation material) to an already-signed PDF,
      producing a PAdES-B-LTA document. Returns the timestamped PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — an already-signed PDF.</li>
        <li><strong>optionsJson</strong> — <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>contents_size</code>.</li>
        <li><strong>returns</strong> — the timestamped PDF as <code>byte[]</code>.</li>
      </ul>
      <p><code>addDocTimestamp</code> also adds the DSS validation material for the timestamp
      certificate chain, so the archive timestamp is itself long-term verifiable.</p>

      <h2>Documents &amp; utilities</h2>
      <Code lang="java" file="SetMetadata.java" code={`static byte[] setMetadata(byte[] pdf, String optionsJson)`} />
      <p>Set the document information (<code>/Info</code>) metadata on a PDF. Returns the updated PDF
      bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to update.</li>
        <li><strong>optionsJson</strong> — <code>title</code>, <code>author</code>, <code>subject</code>, <code>keywords</code>, <code>application</code>, <code>created</code>, <code>modified</code> (see the Metadata options table).</li>
        <li><strong>returns</strong> — the updated PDF as <code>byte[]</code>.</li>
      </ul>
      <Code lang="java" file="Decrypt.java" code={`static byte[] decrypt(byte[] pdf, String password)`} />
      <p>Decrypt a password-protected PDF. Returns the plaintext PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the encrypted PDF.</li>
        <li><strong>password</strong> — the open (user) password.</li>
        <li><strong>returns</strong> — the decrypted PDF as <code>byte[]</code>.</li>
      </ul>
      <Code lang="java" file="SetFastSigning.java" code={`static void setFastSigning(boolean on)`} />
      <p>Enable or disable the in-memory revocation cache (used to speed up repeated CRL/OCSP
      lookups). Passing <code>false</code> disables it.</p>
      <ul>
        <li><strong>on</strong> — <code>true</code> to enable the cache, <code>false</code> to disable it.</li>
      </ul>
      <Code lang="java" file="Version.java" code={`static String version()`} />
      <p>Return the library version string.</p>
      <ul>
        <li><strong>returns</strong> — the version as a <code>String</code>.</li>
      </ul>
      <Code lang="java" file="PrintVersion.java" code={`System.out.println("ATick " + Atick.version());`} />

      <h2>Options JSON</h2>
      <p>The <code>optionsJson</code> argument is a JSON object string. All keys are optional unless a
      method note says otherwise. Keys are grouped below by purpose.</p>

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
          <tr><td><code>green_tick</code></td><td>bool</td><td>Use the validity verified mark.</td></tr>
          <tr><td><code>always_check</code></td><td>bool</td><td>Always draw the verified/checked mark.</td></tr>
          <tr><td><code>mark_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Colour of the mark.</td></tr>
          <tr><td><code>mark_gradient</code></td><td>array of colours</td><td>Gradient fill for the mark.</td></tr>
          <tr><td><code>mark_scale</code></td><td>number</td><td>Scale factor for the mark size.</td></tr>
        </tbody>
      </table>

      <h3>Layout &amp; styling</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>text_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Text colour.</td></tr>
          <tr><td><code>bg_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Background colour of the appearance.</td></tr>
          <tr><td><code>border</code></td><td>bool</td><td>Draw a border around the appearance.</td></tr>
          <tr><td><code>font_size</code></td><td>number</td><td>Font size of the appearance text.</td></tr>
          <tr><td><code>width</code></td><td>number</td><td>Appearance width.</td></tr>
          <tr><td><code>height</code></td><td>number</td><td>Appearance height.</td></tr>
        </tbody>
      </table>

      <h3>Appearance fine-tuning</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>top_reserve</code></td><td>number</td><td>Fraction of the box height reserved at the top for the logo / validity mark (e.g. <code>0.32</code>).</td></tr>
          <tr><td><code>mark_scale</code></td><td>number</td><td>Scale factor for the validity mark.</td></tr>
          <tr><td><code>mark_dx</code></td><td>number</td><td>Nudge the validity mark horizontally (PDF points).</td></tr>
          <tr><td><code>mark_dy</code></td><td>number</td><td>Nudge the validity mark vertically (PDF points).</td></tr>
          <tr><td><code>text_dx</code></td><td>number</td><td>Nudge the text block horizontally (PDF points).</td></tr>
          <tr><td><code>text_top</code></td><td>number</td><td>Nudge the text block vertically from the top.</td></tr>
          <tr><td><code>border_color</code></td><td><code>[r, g, b]</code></td><td>Border colour (used with <code>border</code>).</td></tr>
          <tr><td><code>border_width</code></td><td>number</td><td>Border width in points (used with <code>border</code>).</td></tr>
        </tbody>
      </table>

      <h3>Placement</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>page</code></td><td>int</td><td>Page number for the signature (1-based).</td></tr>
          <tr><td><code>rect</code></td><td><code>[x1, y1, x2, y2]</code></td><td>Rectangle of the appearance on <code>page</code>.</td></tr>
          <tr><td><code>placements</code></td><td><code>[[page, [x1, y1, x2, y2]], ...]</code></td><td>Multiple appearance placements (one signature, several pages).</td></tr>
          <tr><td><code>mode</code></td><td><code>&quot;single&quot; | &quot;shared&quot;</code></td><td>Whether placements share one signature (<code>&quot;single&quot;</code>) or are separate.</td></tr>
          <tr><td><code>field_name</code></td><td>string</td><td>Name of the signature field.</td></tr>
        </tbody>
      </table>

      <h3>Cryptography &amp; PAdES</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>pades</code></td><td>bool</td><td>Produce a PAdES signature.</td></tr>
          <tr><td><code>hash_algo</code></td><td><code>&quot;sha256&quot; | &quot;sha384&quot; | &quot;sha512&quot;</code></td><td>Digest algorithm.</td></tr>
          <tr><td><code>timestamp</code></td><td>bool</td><td>Add an RFC-3161 signature timestamp.</td></tr>
          <tr><td><code>tsa_url</code></td><td>string</td><td>Timestamp authority URL.</td></tr>
          <tr><td><code>tsa_auth</code></td><td><code>[&quot;user&quot;, &quot;pass&quot;]</code></td><td>Basic-auth credentials for the TSA.</td></tr>
          <tr><td><code>ltv</code></td><td>bool</td><td>Add long-term validation material (DSS).</td></tr>
          <tr><td><code>revocation</code></td><td>bool</td><td>On <code>cmsPfx</code>, embed the <code>RevocationInfoArchival</code> attribute (CRL/OCSP responses) inside the CMS.</td></tr>
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
      <p>Each check runs <strong>before</strong> signing; if it fails, no output is produced and the
      method throws <code>Atick.AtickException</code>. Use <code>verify</code> to run all checks at
      once, or enable the granular keys individually.</p>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>verify</code></td><td>bool</td><td>Run the full set of pre-sign checks (expiry + CRL + OCSP); refuse to sign on any failure.</td></tr>
          <tr><td><code>verify_expiry</code></td><td>bool</td><td>Refuse to sign if the certificate is expired or not yet valid.</td></tr>
          <tr><td><code>verify_crl</code></td><td>bool</td><td>Pre-sign CRL revocation check.</td></tr>
          <tr><td><code>verify_ocsp</code></td><td>bool</td><td>Pre-sign OCSP revocation check.</td></tr>
          <tr><td><code>trusted_roots</code></td><td><code>[...]</code> base64/DER</td><td>Extra trusted roots (base64-encoded DER certificates) used by the checks above.</td></tr>
        </tbody>
      </table>
      <Code lang="java" file="VerifyOptions.java" code={`String options =
    "{\\"password\\":\\"secret\\"," +
    "\\"verify_expiry\\":true," +     // refuse if expired / not yet valid
    "\\"verify_crl\\":true," +        // pre-sign CRL check
    "\\"verify_ocsp\\":true," +       // pre-sign OCSP check
    "\\"trusted_roots\\":[\\"<base64 DER root>\\"]}";`} />

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

      <h2>Exceptions</h2>
      <Code lang="java" file="Exception.java" code={`public static class AtickException extends RuntimeException`} />
      <p>Thrown by every <code>Atick</code> operation on failure — bad password, malformed PDF, network
      error, invalid options, and so on. The error text is available from <code>getMessage()</code>.</p>
      <Code lang="java" file="Catch.java" code={`try {
    byte[] signed = Atick.signPfx(pdf, pfx, options);
} catch (Atick.AtickException e) {
    System.err.println("ATick error: " + e.getMessage());
}`} />
    </DocsShell>
  );
}
