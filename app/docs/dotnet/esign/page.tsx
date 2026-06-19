import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Indian eSign (CCA) · .NET', description: 'Deferred / remote-key and eSign signing with ATick for .NET — prepare, hash, sign externally and embed.', alternates: { canonical: '/docs/dotnet/esign/' } };

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="esign">
      <h1>Indian eSign (CCA)</h1>
      <p>ATick for .NET supports the CCA eSign Online Electronic Signature Service for
      <strong>every API version</strong> (v1.x … v3.x). The flow is the same across versions — only
      the request XML attributes differ. The same two-step pattern also covers any
      <strong>remote key</strong>: an HSM, USB token, smart-card, or the Windows certificate store.</p>

      <Code lang="text" file="flow.txt" code={`PDF  ->  SHA-256 of the ByteRange (the InputHash, hex)
     ->  build the <Esign …> request XML for your version, put the InputHash in <InputHash>
     ->  sign the request XML (your own means / your ESP's SDK)   [enveloped W3C XML-DSig]
     ->  POST it (multipart/form-data) to the ESP
     ->  EsignResp -> <DocSignature> (pkcs7 / pkcs7Pdf / pkcs7complete)
     ->  embed it into the PDF`} />

      <Code lang="dotnet" file="Usings.cs" code={`using Aniketc068.ATick;
using System.IO;
using System.Security.Cryptography;`} />

      <p>Every call takes its configuration as a single <strong>JSON options string</strong>, and
      every failure throws <code>AtickException</code>.</p>

      <h2>Step 1 — prepare + hash</h2>
      <p><code>Atick.Prepare</code> returns a value tuple: <code>.Prepared</code> is the prepared PDF,
      <code>.BytesToSign</code> is the exact bytes that must be signed (the ByteRange). The eSign
      <strong>InputHash</strong> is simply the SHA-256 of <code>.BytesToSign</code>.</p>

      <Code lang="dotnet" file="Prepare.cs" code={`byte[] pdf = File.ReadAllBytes("in.pdf");

// options: cn, reason, placements / page+rect, field_name, pades, contents_size.
// Leave room for the chain + revocation + timestamp that a pkcs7Pdf reply carries.
var (prepared, bytesToSign) = Atick.Prepare(pdf,
    "{\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Agreement\\",\\"pades\\":true,"
  + "\\"page\\":1,\\"rect\\":[40,640,300,750],\\"contents_size\\":60000}");

// The InputHash that goes into <InputHash> (hex).
byte[] digest = SHA256.HashData(bytesToSign);
string inputHashHex = Convert.ToHexString(digest).ToLowerInvariant();`} />

      <h2>Step 2 — build and sign the request XML</h2>
      <p>Put <code>inputHashHex</code> into <code>&lt;InputHash&gt;</code>, then sign the request XML
      (an enveloped W3C XML-DSig) with your own means — your ASP signing key or your ESP&apos;s SDK —
      and POST it to the ESP.</p>

      <Code lang="dotnet" file="Request.cs" code={`string request =
    "<Esign ver=\\"2.1\\" sc=\\"Y\\" ts=\\"…\\" txn=\\"TXN1\\" ekycIdType=\\"A\\" aspId=\\"…\\" "
  + "AuthMode=\\"1\\" responseSigType=\\"pkcs7Pdf\\" responseUrl=\\"https://…/\\"><Docs>"
  + "<InputHash id=\\"1\\" hashAlgorithm=\\"SHA256\\" docInfo=\\"Agreement\\">"
  + inputHashHex
  + "</InputHash></Docs></Esign>";

// Sign request (enveloped XML-DSig) with your own means / your ESP's SDK,
// then POST the signed XML (multipart/form-data) to the ESP.`} />

      <blockquote>The request XML is signed with <strong>your ASP credential</strong>, not with
      ATick. ATick&apos;s job is the PDF: it produced <code>inputHashHex</code> from the ByteRange in
      step 1, and it will embed the ESP&apos;s reply in step 3.</blockquote>

      <h2>Step 3 — embed the ESP response</h2>
      <p>The <code>EsignResp</code> carries the signature in <code>&lt;DocSignature&gt;</code>
      (Base64). Decode it and pass the resulting CMS bytes to <code>Atick.Embed</code>, together with
      the prepared PDF from step 1.</p>

      <Code lang="dotnet" file="Embed.cs" code={`byte[] cms = Convert.FromBase64String(docSignatureBase64);  // from <DocSignature>

byte[] signed = Atick.Embed(prepared, cms);
File.WriteAllBytes("signed.pdf", signed);`} />

      <p><code>pkcs7Pdf</code> and <code>pkcs7complete</code> responses already carry the full chain,
      the revocation (under <code>pdfRevocationInfoArchival</code>) and a CA timestamp — so the
      embedded signature is <strong>LTV-complete and timestamped</strong> out of the box.</p>

      <h2>responseSigType</h2>
      <table>
        <thead>
          <tr><th>Value</th><th>Returns</th><th>Embed with</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pkcs7</code></td><td>a CMS, signer cert only (no revocation)</td><td><code>Atick.Embed</code></td></tr>
          <tr><td><code>pkcs7Pdf</code></td><td>a CMS, full chain + CRL/OCSP (signed attr) + timestamp</td><td><code>Atick.Embed</code></td></tr>
          <tr><td><code>pkcs7complete</code></td><td>a CMS, full chain + revocation (unsigned attr)</td><td><code>Atick.Embed</code></td></tr>
        </tbody>
      </table>

      <p>Request a <code>pkcs7Pdf</code> or <code>pkcs7complete</code> reply so the embedded signature
      is LTV-complete.</p>

      <h2>Other remote keys — HSM, token, card, Windows store</h2>
      <p>The same three steps cover any key that never leaves its holder. Instead of POSTing to an
      ESP, sign <code>bytesToSign</code> directly with your own provider and produce a
      <strong>detached CMS / PKCS#7 SignedData</strong>:</p>
      <ul>
        <li><strong>HSM / USB token / smart-card</strong> — a PKCS#11 provider, or a CNG key
        provider.</li>
        <li><strong>Windows certificate store</strong> —
        <code>System.Security.Cryptography.X509Certificates</code> /
        <code>System.Security.Cryptography.Pkcs.SignedCms</code> over a CNG provider.</li>
      </ul>

      <Code lang="dotnet" file="RemoteKey.cs" code={`var (prepared, bytesToSign) = Atick.Prepare(pdf,
    "{\\"cn\\":\\"Axonate Tech\\",\\"reason\\":\\"Approved\\",\\"pades\\":true}");

// Sign bytesToSign with your provider; return a detached CMS over those exact bytes.
byte[] cms = SignWithMyProvider(bytesToSign);   // PKCS#11 token / HSM / Windows store

byte[] signed = Atick.Embed(prepared, cms);
File.WriteAllBytes("signed.pdf", signed);`} />

      <blockquote>The CMS you build in step 2 must cover <strong><code>bytesToSign</code></strong>
      exactly and use the same hash algorithm (SHA-256 by default) that ATick used to prepare the
      document. ATick owns the PDF structure; your provider owns the private key.</blockquote>

      <h2>Simulating the ESP for testing</h2>
      <p>To run the whole flow end-to-end without a live ESP, build the detached CMS yourself from a
      credential file with <code>Atick.CmsPfx</code>. It stands in for the external signer, producing
      a <code>pkcs7Pdf</code>-style CMS over <code>bytesToSign</code>:</p>

      <Code lang="dotnet" file="Simulate.cs" code={`byte[] pfx = File.ReadAllBytes("signer.pfx");

var (prepared, bytesToSign) = Atick.Prepare(pdf, "{\\"cn\\":\\"Axonate Tech\\",\\"pades\\":true}");
byte[] cms  = Atick.CmsPfx(bytesToSign, pfx,
                   "{\\"password\\":\\"••••\\",\\"pades\\":true,\\"timestamp\\":true}");
byte[] done = Atick.Embed(prepared, cms);

File.WriteAllBytes("signed.pdf", done);`} />

      <p><a href="/docs/dotnet/api/">Next page →</a></p>
    </DocsShell>
  );
}
