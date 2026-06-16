import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="php" section="esign">
      <h1>Indian eSign (CCA)</h1>
      <p>ATick for PHP supports the CCA eSign Online Electronic Signature Service for <strong>every API version</strong>
      (v1.x … v3.x). The flow is the same across versions — only the request XML attributes differ. The
      same two-step pattern also covers any <strong>remote key</strong>: an HSM, USB token, smart-card, or the Windows
      certificate store.</p>
      <Code lang="php" file="flow.txt" code={`PDF  ->  SHA-256 of the ByteRange (the InputHash, hex)
     ->  build the <Esign …> request XML for your version, put the InputHash in <InputHash>
     ->  sign the request XML (your own means / your ESP's SDK)   [enveloped W3C XML-DSig]
     ->  POST it (multipart/form-data) to the ESP
     ->  EsignResp -> <DocSignature> (pkcs7 / pkcs7Pdf / pkcs7complete)
     ->  embed it into the PDF`} />
      <Code lang="php" file="esign.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;`} />
      <p>Every call takes its configuration as a PHP associative array (or a JSON options string), and every
      failure throws an <code>AtickException</code>.</p>

      <h2>Step 1 — prepare + hash</h2>
      <p><code>Atick::prepare</code> returns an array: the first element is the prepared PDF, and the second is the exact
      bytes that must be signed (the ByteRange). The eSign <strong>InputHash</strong> is simply the SHA-256 of
      <code> $bytesToSign</code>.</p>
      <Code lang="php" file="esign.php" code={`$pdf = file_get_contents("in.pdf");

// options: cn, reason, placements / page+rect, field_name, pades, contents_size.
// Leave room for the chain + revocation + timestamp that a pkcs7Pdf reply carries.
[$prepared, $bytesToSign] = Atick::prepare($pdf, [
  "cn" => "DS TEST",
  "reason" => "eSign",
  "placements" => [[1, [300, 55, 575, 175]]],
  "contents_size" => 16384
]);

// The InputHash that goes into <InputHash> (hex).
$inputHashHex = hash("sha256", $bytesToSign);`} />

      <h2>Step 2 — build and sign the request XML</h2>
      <p>Put <code>$inputHashHex</code> into <code>&lt;InputHash&gt;</code>, then sign the request XML (an enveloped W3C XML-DSig) with
      your own means — your ASP signing key or your ESP&apos;s SDK — and POST it to the ESP.</p>
      <Code lang="php" file="esign.php" code={`$request =
    '<Esign ver="2.1" sc="Y" ts="…" txn="TXN1" ekycIdType="A" aspId="…" '
  . 'AuthMode="1" responseSigType="pkcs7Pdf" responseUrl="https://…/"><Docs>'
  . '<InputHash id="1" hashAlgorithm="SHA256" docInfo="Agreement">'
  . $inputHashHex
  . '</InputHash></Docs></Esign>';

// Sign $request (enveloped XML-DSig) with your own means / your ESP's SDK,
// then POST the signed XML (multipart/form-data) to the ESP.`} />
      <blockquote>The request XML is signed with <strong>your ASP credential</strong>, not with ATick. ATick&apos;s job is the PDF: it
      produced <code>$inputHashHex</code> from the ByteRange in step 1, and it will embed the ESP&apos;s reply in step 3.</blockquote>

      <h2>Step 3 — embed the ESP response</h2>
      <p>The <code>EsignResp</code> carries the signature in <code>&lt;DocSignature&gt;</code> (Base64). Decode it and pass the resulting
      CMS bytes to <code>Atick::embed</code>, together with the prepared PDF from step 1.</p>
      <Code lang="php" file="esign.php" code={`$cms = base64_decode($docSignatureBase64);  // from <DocSignature>

$signed = Atick::embed($prepared, $cms);
file_put_contents("signed.pdf", $signed);`} />
      <p><code>pkcs7Pdf</code> and <code>pkcs7complete</code> responses already carry the full chain, the revocation (under
      <code> pdfRevocationInfoArchival</code>) and a CA timestamp — so the embedded signature is <strong>LTV-complete and
      timestamped</strong> out of the box.</p>

      <h2>responseSigType</h2>
      <table>
        <thead>
          <tr><th>Value</th><th>Returns</th><th>Embed with</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pkcs7</code></td><td>a CMS, signer cert only (no revocation)</td><td><code>Atick::embed</code></td></tr>
          <tr><td><code>pkcs7Pdf</code></td><td>a CMS, full chain + CRL/OCSP (signed attr) + timestamp</td><td><code>Atick::embed</code></td></tr>
          <tr><td><code>pkcs7complete</code></td><td>a CMS, full chain + revocation (unsigned attr)</td><td><code>Atick::embed</code></td></tr>
        </tbody>
      </table>
      <p>Request a <code>pkcs7Pdf</code> or <code>pkcs7complete</code> reply so the embedded signature is LTV-complete.</p>

      <h2>Other remote keys — HSM, token, card, Windows store</h2>
      <p>The same three steps cover any key that never leaves its holder. Instead of POSTing to an ESP, sign
      <code> $bytesToSign</code> directly with your own signer and produce a <strong>detached CMS / PKCS#7 SignedData</strong>:</p>
      <ul>
        <li><strong>HSM / USB token / smart-card</strong> — your vendor&apos;s PKCS#11 module.</li>
        <li><strong>Windows certificate store</strong> — the native certificate store API.</li>
      </ul>
      <Code lang="php" file="remote.php" code={`[$prepared, $bytesToSign] = Atick::prepare($pdf, [
  "cn" => "DS TEST",
  "reason" => "Approved",
  "pades" => true
]);

// Sign $bytesToSign with your own signer; return a detached CMS over those exact bytes.
$cms = signWithMyProvider($bytesToSign);   // PKCS#11 module / native store / vendor signer

$signed = Atick::embed($prepared, $cms);
file_put_contents("signed.pdf", $signed);`} />
      <blockquote>The CMS you build in step 2 must cover <strong><code>$bytesToSign</code></strong> exactly and use the same hash algorithm
      (SHA-256 by default) that ATick used to prepare the document. ATick owns the PDF structure; your
      signer owns the private key.</blockquote>

      <h2>Simulating the ESP for testing</h2>
      <p>To run the whole flow end-to-end without a live ESP, build the detached CMS yourself from a
      credential file with <code>Atick::cmsPfx</code>. It stands in for the external signer, producing a
      <code> pkcs7Pdf</code>-style CMS over <code>$bytesToSign</code>:</p>
      <Code lang="php" file="simulate.php" code={`$pfx = file_get_contents("signer.pfx");

[$prepared, $bytesToSign] = Atick::prepare($pdf, ["cn" => "DS TEST", "pades" => true]);
$cms = Atick::cmsPfx($bytesToSign, $pfx, [
  "password" => "••••",
  "pades" => true,
  "timestamp" => true
]);
$done = Atick::embed($prepared, $cms);

file_put_contents("signed.pdf", $done);`} />

      <p><a href="/docs/php/api/">Next page →</a></p>
    </DocsShell>
  );
}
