import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="api">
      <h1>API reference</h1>
      <p>All operations are static methods on <code>Aniketc068.ATick.Atick</code>. Every method takes
      raw <code>byte[]</code> for PDFs and certificates, and an options JSON string where applicable.
      On any failure a method throws <code>AtickException</code> — a sealed class extending
      <code>Exception</code>. The error text is available from <code>e.Message</code>.</p>

      <Code lang="dotnet" file="Using.cs" code={`using Aniketc068.ATick;`} />

      <h2>Signing</h2>
      <Code lang="dotnet" file="SignPfx.cs" code={`static byte[] SignPfx(byte[] pdf, byte[] pfx, string optionsJson)`} />
      <p>Sign <code>pdf</code> with a <code>.pfx</code>/<code>.p12</code>/<code>.pem</code> credential
      (the format is auto-detected). For a PEM file pass the password as the empty string
      <code>&quot;&quot;</code> inside the options. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to sign.</li>
        <li><strong>pfx</strong> — the credential bytes (<code>.pfx</code>, <code>.p12</code>, or <code>.pem</code>).</li>
        <li><strong>optionsJson</strong> — the options JSON (see the Options table below). Pass the credential password as the <code>password</code> key; use <code>&quot;&quot;</code> for PEM.</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>

      <Code lang="dotnet" file="SignExample.cs" code={`using Aniketc068.ATick;

byte[] pdf = File.ReadAllBytes("in.pdf");
byte[] pfx = File.ReadAllBytes("signer.pfx");

string options = """
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

try
{
    byte[] signed = Atick.SignPfx(pdf, pfx, options);
    File.WriteAllBytes("signed.pdf", signed);
}
catch (AtickException e)
{
    Console.Error.WriteLine("signing failed: " + e.Message);
}`} />

      <Code lang="dotnet" file="SignField.cs" code={`static byte[] SignField(byte[] pdf, byte[] pfx, string optionsJson)`} />
      <p>Sign an existing empty signature field. Use the <code>field_name</code> option to select the
      field. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — a PDF containing an empty signature field (see <code>PrepareFields</code>).</li>
        <li><strong>pfx</strong> — the credential bytes.</li>
        <li><strong>optionsJson</strong> — must include <code>field_name</code>; same credential and signing keys as <code>SignPfx</code>.</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>

      <h2>Deferred / remote-key signing</h2>
      <p>These three methods cover the deferred (eSign / HSM / remote-key) flow: prepare the PDF, sign
      the returned bytes elsewhere, then embed the resulting CMS.</p>

      <Code lang="dotnet" file="Prepare.cs" code={`static (byte[] Prepared, byte[] BytesToSign) Prepare(byte[] pdf, string optionsJson)`} />
      <p>Step 1 of deferred signing. Adds an empty signature field, the appearance, and the signature
      container, then returns the exact bytes that must be signed. Returns a value tuple of two
      elements:</p>
      <ul>
        <li><code>Prepared</code> — the <strong>prepared PDF</strong> (<code>byte[]</code>).</li>
        <li><code>BytesToSign</code> — the <strong>bytes to sign</strong> (<code>byte[]</code>); hash and sign these with the remote key.</li>
        <li><strong>pdf</strong> — the PDF to prepare.</li>
        <li><strong>optionsJson</strong> — appearance and signing options (see the Options table below).</li>
        <li><strong>returns</strong> — <code>(byte[] Prepared, byte[] BytesToSign)</code>.</li>
      </ul>

      <Code lang="dotnet" file="CmsPfx.cs" code={`static byte[] CmsPfx(byte[] data, byte[] pfx, string optionsJson)`} />
      <p>Produce a detached PKCS#7 / CMS signature over <code>data</code> using a PFX. Useful for
      producing the CMS that <code>Embed</code> expects when the signing credential is a local PFX.</p>
      <ul>
        <li><strong>data</strong> — the bytes to sign (typically <code>BytesToSign</code> from <code>Prepare</code>).</li>
        <li><strong>pfx</strong> — the credential bytes.</li>
        <li><strong>optionsJson</strong> — <code>password</code>, <code>hash_algo</code>, <code>pades</code>, <code>timestamp</code>, <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>revocation</code>.</li>
        <li><strong>returns</strong> — the detached CMS as <code>byte[]</code>.</li>
      </ul>
      <p>Set <code>&quot;revocation&quot;:true</code> to embed a RevocationInfoArchival attribute (the
      CRL/OCSP responses for the signer chain) inside the CMS, so the signature carries its own
      revocation evidence. Pair it with <code>AddDocTimestamp</code> — which adds the DSS for the
      timestamp chain — for a fully self-contained, long-term-verifiable result.</p>
      <Code lang="dotnet" file="CmsRevocation.cs" code={`// CMS that embeds its own revocation info
byte[] cms = Atick.CmsPfx(bytesToSign, pfx,
    "{\\"password\\":\\"secret\\",\\"pades\\":true,\\"revocation\\":true}");

byte[] signed = Atick.Embed(prepared, cms);

// add the DSS for the timestamp chain (PAdES-B-LTA)
byte[] lta = Atick.AddDocTimestamp(signed, "{\\"tsa_url\\":\\"http://timestamp.example/tsa\\"}");`} />

      <Code lang="dotnet" file="Embed.cs" code={`static byte[] Embed(byte[] prepared, byte[] cms)`} />
      <p>Embed a detached CMS / PKCS#7 into a prepared PDF. Returns the signed PDF bytes.</p>
      <ul>
        <li><strong>prepared</strong> — the prepared PDF (<code>Prepared</code> from <code>Prepare</code>).</li>
        <li><strong>cms</strong> — the detached CMS (from <code>CmsPfx</code>, an eSign reply, or an HSM).</li>
        <li><strong>returns</strong> — the signed PDF as <code>byte[]</code>.</li>
      </ul>

      <Code lang="dotnet" file="DeferredExample.cs" code={`using Aniketc068.ATick;

var (prepared, bytesToSign) = Atick.Prepare(pdf, options);

byte[] cms    = Atick.CmsPfx(bytesToSign, pfx, "{\\"password\\":\\"secret\\"}");
byte[] signed = Atick.Embed(prepared, cms);`} />

      <h2>Field templates</h2>
      <Code lang="dotnet" file="PrepareFields.cs" code={`static byte[] PrepareFields(byte[] pdf, string optionsJson)`} />
      <p>Create an empty signature field as a template: the appearance is drawn, but the signature is
      left empty so it can be signed later with <code>SignField</code>. Returns the PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to add the field to.</li>
        <li><strong>optionsJson</strong> — appearance options plus <code>field_name</code>, <code>page</code>, <code>rect</code> / <code>placements</code>.</li>
        <li><strong>returns</strong> — the PDF with an empty field as <code>byte[]</code>.</li>
      </ul>

      <h2>Long-term validation &amp; timestamps</h2>
      <Code lang="dotnet" file="AddDocTimestamp.cs" code={`static byte[] AddDocTimestamp(byte[] pdf, string optionsJson)`} />
      <p>Add an archive DocTimeStamp (and the DSS validation material) to an already-signed PDF,
      producing a PAdES-B-LTA document. Returns the timestamped PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — an already-signed PDF.</li>
        <li><strong>optionsJson</strong> — <code>tsa_url</code>, <code>tsa_auth</code>, <code>ltv</code>, <code>contents_size</code>.</li>
        <li><strong>returns</strong> — the timestamped PDF as <code>byte[]</code>.</li>
      </ul>

      <h2>Documents &amp; utilities</h2>
      <Code lang="dotnet" file="SetMetadata.cs" code={`static byte[] SetMetadata(byte[] pdf, string optionsJson)`} />
      <p>Set the document information (<code>/Info</code>) metadata on a PDF. Returns the updated PDF
      bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the PDF to update.</li>
        <li><strong>optionsJson</strong> — <code>title</code>, <code>author</code>, <code>subject</code>, <code>keywords</code>, <code>application</code>, <code>created</code>, <code>modified</code> (see the Metadata options table below).</li>
        <li><strong>returns</strong> — the updated PDF as <code>byte[]</code>.</li>
      </ul>

      <Code lang="dotnet" file="Decrypt.cs" code={`static byte[] Decrypt(byte[] pdf, string password)`} />
      <p>Decrypt a password-protected PDF. Returns the plaintext PDF bytes.</p>
      <ul>
        <li><strong>pdf</strong> — the encrypted PDF.</li>
        <li><strong>password</strong> — the open (user) password.</li>
        <li><strong>returns</strong> — the decrypted PDF as <code>byte[]</code>.</li>
      </ul>

      <Code lang="dotnet" file="SetFastSigning.cs" code={`static void SetFastSigning(bool on)`} />
      <p>Enable or disable the in-memory revocation cache (used to speed up repeated CRL/OCSP
      lookups). Passing <code>false</code> disables it.</p>
      <ul>
        <li><strong>on</strong> — <code>true</code> to enable the cache, <code>false</code> to disable it.</li>
      </ul>

      <Code lang="dotnet" file="Version.cs" code={`static string Version()`} />
      <p>Return the version string.</p>
      <ul>
        <li><strong>returns</strong> — the version as a <code>string</code>.</li>
      </ul>

      <Code lang="dotnet" file="VersionExample.cs" code={`Console.WriteLine("ATick " + Atick.Version());`} />

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
          <tr><td><code>green_tick</code></td><td>bool</td><td>Use the verified mark.</td></tr>
          <tr><td><code>always_check</code></td><td>bool</td><td>Always draw the verified/checked mark.</td></tr>
          <tr><td><code>mark_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Colour of the mark.</td></tr>
          <tr><td><code>mark_gradient</code></td><td>array of colours</td><td>Gradient fill for the mark.</td></tr>
          <tr><td><code>mark_scale</code></td><td>number</td><td>Scale factor for the mark size.</td></tr>
          <tr><td><code>mark_dx</code></td><td>number</td><td>Nudge the mark horizontally (PDF points; positive = right).</td></tr>
          <tr><td><code>mark_dy</code></td><td>number</td><td>Nudge the mark vertically (PDF points; positive = up).</td></tr>
          <tr><td><code>top_reserve</code></td><td>number</td><td>Fraction of the box height (e.g. <code>0.32</code>) reserved at the top for the logo / mark.</td></tr>
        </tbody>
      </table>

      <h3>Layout &amp; styling</h3>
      <table>
        <thead><tr><th>Key</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>text_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Text colour.</td></tr>
          <tr><td><code>bg_color</code></td><td>string hex / name / <code>[r,g,b]</code></td><td>Background colour of the appearance.</td></tr>
          <tr><td><code>border</code></td><td>bool</td><td>Draw a border around the appearance.</td></tr>
          <tr><td><code>border_color</code></td><td><code>[r, g, b]</code></td><td>Border colour (requires <code>&quot;border&quot;:true</code>).</td></tr>
          <tr><td><code>border_width</code></td><td>number</td><td>Border line width in points, e.g. <code>1.0</code> (requires <code>&quot;border&quot;:true</code>).</td></tr>
          <tr><td><code>text_dx</code></td><td>number</td><td>Nudge the signer text horizontally (PDF points; positive = right).</td></tr>
          <tr><td><code>text_top</code></td><td>number</td><td>Vertical start of the text block, as a fraction of box height from the top.</td></tr>
          <tr><td><code>font_size</code></td><td>number</td><td>Font size of the appearance text.</td></tr>
          <tr><td><code>width</code></td><td>number</td><td>Appearance width.</td></tr>
          <tr><td><code>height</code></td><td>number</td><td>Appearance height.</td></tr>
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
          <tr><td><code>trusted_roots</code></td><td>array of strings</td><td>Extra pinned root SHA-1 hex strings; the chain (built from AIA) must reach one of them.</td></tr>
        </tbody>
      </table>

      <Code lang="dotnet" file="VerifyOptions.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"secret\\"," +
    "\\"verify_expiry\\":true," +
    "\\"verify_crl\\":true," +
    "\\"verify_ocsp\\":true," +
    "\\"trusted_roots\\":[\\"<root SHA-1>\\"]}");`} />

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
      <p>These keys apply to <code>SetMetadata</code>.</p>
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
      <Code lang="dotnet" file="AtickException.cs" code={`public sealed class AtickException : Exception`} />
      <p>Thrown by every <code>Atick</code> operation on failure — bad password, malformed PDF,
      network error, invalid options, and so on. The error text is available from <code>Message</code>.</p>

      <Code lang="dotnet" file="Catch.cs" code={`try
{
    byte[] signed = Atick.SignPfx(pdf, pfx, options);
}
catch (AtickException e)
{
    Console.Error.WriteLine("ATick error: " + e.Message);
}`} />
    </DocsShell>
  );
}
