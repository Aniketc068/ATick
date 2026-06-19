import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Indian eSign (CCA) · Java', description: 'Deferred / remote-key and eSign signing with ATick for Java — prepare, hash, sign externally and embed.', alternates: { canonical: '/docs/java/esign/' } };

export default function Page() {
  return (
    <DocsShell lang="java" section="esign">
      <h1>Indian eSign (CCA)</h1>
      <p>ATick for Java supports the CCA eSign Online Electronic Signature Service for <strong>every
      API version</strong> (v1.x … v3.x). The flow is the same across versions — only the request XML
      attributes differ. The same two-step pattern also covers any <strong>remote key</strong>: an
      HSM, USB token, smart-card, or the Windows certificate store.</p>
      <Code lang="java" file="Flow.java" code={`PDF  ->  SHA-256 of the ByteRange (the InputHash, hex)
     ->  build the <Esign …> request XML for your version, put the InputHash in <InputHash>
     ->  sign the request XML (your own means / your ESP's SDK)   [enveloped W3C XML-DSig]
     ->  POST it (multipart/form-data) to the ESP
     ->  EsignResp -> <DocSignature> (pkcs7 / pkcs7Pdf / pkcs7complete)
     ->  embed it into the PDF`} />
      <Code lang="java" file="Imports.java" code={`import io.github.aniketc068.atick.Atick;
import java.nio.file.*;
import java.security.MessageDigest;`} />
      <p>Every call takes its configuration as a single <strong>JSON options string</strong>, and
      every failure throws <code>Atick.AtickException</code>.</p>

      <h2>Step 1 — prepare + hash</h2>
      <p><code>Atick.prepare</code> returns a two-element array: index <strong>0</strong> is the
      prepared PDF, index <strong>1</strong> is the exact bytes that must be signed (the ByteRange).
      The eSign <strong>InputHash</strong> is simply the SHA-256 of index 1.</p>
      <Code lang="java" file="Prepare.java" code={`byte[] pdf = Files.readAllBytes(Path.of("in.pdf"));

// options: cn, reason, placements / page+rect, field_name, pades, contents_size.
// Leave room for the chain + revocation + timestamp that a pkcs7Pdf reply carries.
byte[][] pr = Atick.prepare(pdf,
    "{\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Agreement\\",\\"pades\\":true,"
  + "\\"page\\":1,\\"rect\\":[40,640,300,750],\\"contents_size\\":60000}");

byte[] prepared    = pr[0];
byte[] bytesToSign = pr[1];

// The InputHash that goes into <InputHash> (hex).
byte[] digest = MessageDigest.getInstance("SHA-256").digest(bytesToSign);
StringBuilder sb = new StringBuilder();
for (byte b : digest) sb.append(String.format("%02x", b));
String inputHashHex = sb.toString();`} />

      <h2>Step 2 — build and sign the request XML</h2>
      <p>Put <code>inputHashHex</code> into <code>&lt;InputHash&gt;</code>, then sign the request XML
      (an enveloped W3C XML-DSig) with your own means — your ASP signing key or your ESP&apos;s SDK —
      and POST it to the ESP.</p>
      <Code lang="java" file="Request.java" code={`String request =
    "<Esign ver=\\"2.1\\" sc=\\"Y\\" ts=\\"…\\" txn=\\"TXN1\\" ekycIdType=\\"A\\" aspId=\\"…\\" "
  + "AuthMode=\\"1\\" responseSigType=\\"pkcs7Pdf\\" responseUrl=\\"https://…/\\"><Docs>"
  + "<InputHash id=\\"1\\" hashAlgorithm=\\"SHA256\\" docInfo=\\"Agreement\\">"
  + inputHashHex
  + "</InputHash></Docs></Esign>";

// Sign \`request\` (enveloped XML-DSig) with your own means / your ESP's SDK,
// then POST the signed XML (multipart/form-data) to the ESP.`} />
      <blockquote>The request XML is signed with <strong>your ASP credential</strong>, not with ATick.
      ATick&apos;s job is the PDF: it produced <code>inputHashHex</code> from the ByteRange in step 1,
      and it will embed the ESP&apos;s reply in step 3.</blockquote>

      <h2>Step 3 — embed the ESP response</h2>
      <p>The <code>EsignResp</code> carries the signature in <code>&lt;DocSignature&gt;</code>
      (Base64). Decode it and pass the resulting CMS bytes to <code>Atick.embed</code>, together with
      the prepared PDF from step 1.</p>
      <Code lang="java" file="Embed.java" code={`byte[] cms = java.util.Base64.getDecoder().decode(docSignatureBase64);  // from <DocSignature>

byte[] signed = Atick.embed(prepared, cms);
Files.write(Path.of("signed.pdf"), signed);`} />
      <p><code>pkcs7Pdf</code> and <code>pkcs7complete</code> responses already carry the full chain,
      the revocation (under <code>pdfRevocationInfoArchival</code>) and a CA timestamp — so the
      embedded signature is <strong>LTV-complete and timestamped</strong> out of the box.</p>

      <h2>responseSigType</h2>
      <table>
        <thead>
          <tr><th>Value</th><th>Returns</th><th>Embed with</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pkcs7</code></td><td>a CMS, signer cert only (no revocation)</td><td><code>Atick.embed</code></td></tr>
          <tr><td><code>pkcs7Pdf</code></td><td>a CMS, full chain + CRL/OCSP (signed attr) + timestamp</td><td><code>Atick.embed</code></td></tr>
          <tr><td><code>pkcs7complete</code></td><td>a CMS, full chain + revocation (unsigned attr)</td><td><code>Atick.embed</code></td></tr>
        </tbody>
      </table>
      <p>Request a <code>pkcs7Pdf</code> or <code>pkcs7complete</code> reply so the embedded signature
      is LTV-complete.</p>

      <h2>Other remote keys — HSM, token, card, Windows store</h2>
      <p>The same three steps cover any key that never leaves its holder. Instead of POSTing to an ESP,
      sign <code>bytesToSign</code> directly with your own JCA provider and produce a <strong>detached
      CMS / PKCS#7 SignedData</strong>:</p>
      <ul>
        <li><strong>HSM / USB token / smart-card</strong> — <code>SunPKCS11</code> (or your
        vendor&apos;s PKCS#11 provider).</li>
        <li><strong>Windows certificate store</strong> — <code>SunMSCAPI</code>.</li>
      </ul>
      <Code lang="java" file="RemoteKey.java" code={`byte[][] pr = Atick.prepare(pdf, "{\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Approved\\",\\"pades\\":true}");

// Sign pr[1] with your JCA provider; return a detached CMS over those exact bytes.
byte[] cms = signWithMyProvider(pr[1]);   // SunPKCS11 / SunMSCAPI / vendor provider

byte[] signed = Atick.embed(pr[0], cms);
Files.write(Path.of("signed.pdf"), signed);`} />
      <blockquote>The CMS you build in step 2 must cover <strong><code>pr[1]</code></strong> exactly
      and use the same hash algorithm (SHA-256 by default) that ATick used to prepare the document.
      ATick owns the PDF structure; your provider owns the private key.</blockquote>

      <h2>Simulating the ESP for testing</h2>
      <p>To run the whole flow end-to-end without a live ESP, build the detached CMS yourself from a
      credential file with <code>Atick.cmsPfx</code>. It stands in for the external signer, producing
      a <code>pkcs7Pdf</code>-style CMS over <code>pr[1]</code>:</p>
      <Code lang="java" file="Simulate.java" code={`byte[] pfx = Files.readAllBytes(Path.of("signer.pfx"));

byte[][] pr   = Atick.prepare(pdf, "{\\"cn\\":\\"Axonate Tech\\",\\"pades\\":true}");
byte[]   cms  = Atick.cmsPfx(pr[1], pfx,
                   "{\\"password\\":\\"••••\\",\\"pades\\":true,\\"timestamp\\":true}");
byte[]   done = Atick.embed(pr[0], cms);

Files.write(Path.of("signed.pdf"), done);`} />

      <p><a href="/docs/java/api/">Next page →</a></p>
    </DocsShell>
  );
}
