import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="python" section="esign">
      <h1>Indian eSign (CCA)</h1>

      <p>ATick supports the CCA eSign Online Electronic Signature Service for <strong>every API
      version</strong> (v1.x … v3.x). The flow is the same across versions — only the request XML
      attributes differ.</p>

      <Code lang="text" file="flow.txt" code={`PDF  ->  SHA-256 of the ByteRange (the InputHash, hex)
     ->  build the <Esign ...> request XML for your version, put the InputHash in <InputHash>
     ->  sign the request XML (your managex-xml-sdk)            [enveloped W3C XML-DSig]
     ->  POST it (multipart/form-data) to the ESP
     ->  EsignResp -> <DocSignature> (rawrsa / pkcs7 / pkcs7Pdf / pkcs7complete)
     ->  embed it into the PDF`} />

      <h2>Step 1 — prepare + hash</h2>
      <Code lang="python" file="esign_prepare.py" code={`prepared, ctx = atick.prepare_deferred_multi(
    pdf, atick.Style(cn="...", always_check=True),
    [(1, (40, 640, 300, 750)), (2, (320, 380, 560, 490))],   # signature box on each page
    mode="single", sub_filter="adbe.pkcs7.detached",
    certify=atick.Certify.FORM_FILLING_ANNOTATIONS,          # CFA -> later timestamp won't invalidate
    contents_size=60000,                                     # room for chain + revocation + timestamp
)
input_hash_hex = bytes(ctx["digest"]).hex()                  # goes into <InputHash>
data = bytes(ctx["data"])                                    # the exact bytes the ESP signs`} />

      <h2>Step 2 — sign the request XML with <code>managex-xml-sdk</code></h2>
      <blockquote><strong><code>managex-xml-sdk</code> needs a trusted-roots folder.</strong> Before
      it will sign, it validates your ASP certificate against the CA root certificate(s) in the
      folder you give as <code>ValidationConfig(trusted_roots_folder=…)</code>. That folder
      <strong>must exist and contain the CA root certificate(s) as PEM files</strong> — if the folder
      is missing or empty, signing the request <strong>fails and eSign will not work</strong>. Put
      your CA&apos;s root (and intermediate) certificates there as <code>.pem</code> files.</blockquote>

      <Code lang="python" file="esign_sign_request.py" code={`import managex_xml_sdk as mx
from managex_xml_sdk.models.certificate_models import PFXConfig, ValidationConfig

request = (f'<Esign ver="2.1" sc="Y" ts="..." txn="TXN1" ekycIdType="A" aspId="..." AuthMode="1" '
           f'responseSigType="pkcs7Pdf" responseUrl="https://.../"><Docs>'
           f'<InputHash id="1" hashAlgorithm="SHA256" docInfo="Agreement">{input_hash_hex}</InputHash>'
           f'</Docs></Esign>')

signer = mx.PFXSigner(PFXConfig(method="pfx", pfx_file="asp.pfx", password="...",
                                validation_config=ValidationConfig(trusted_roots_folder="roots")))
params = mx.SignatureEnvelopeParameters(
    signature_info=mx.SignatureInfo(signature_algorithm=mx.SignatureAlgorithm.RSA_SHA256),
    reference_info=mx.ReferenceInfo(uri="", transforms=[mx.TransformAlgorithm.ENVELOPED_SIGNATURE]),
    key_info=mx.KeyInfo(include_subject_name=True, include_certificate=True))
signed_request = signer.sign_xml_content(request.encode(), params)   # POST this to the ESP`} />

      <h2>Step 3 — embed the ESP response</h2>
      <Code lang="python" file="esign_embed.py" code={`import base64, xml.etree.ElementTree as ET
root = ET.fromstring(esign_response_xml)
doc_sig = base64.b64decode(next(e.text for e in root.iter() if e.tag.endswith("DocSignature")))

signed = atick.embed(prepared, doc_sig)                # pkcs7 / pkcs7Pdf / pkcs7complete (a full CMS)
# rawrsa: atick.embed_rawrsa(prepared, doc_sig, user_cert)`} />

      <p><code>pkcs7Pdf</code> and <code>pkcs7complete</code> responses already carry the full chain,
      the revocation (under <code>pdfRevocationInfoArchival</code>) and a CA timestamp — so the
      embedded signature is LTV-complete and timestamped out of the box.</p>

      <h2><code>responseSigType</code></h2>
      <table>
        <thead>
          <tr><th>Value</th><th>Returns</th><th>Embed with</th></tr>
        </thead>
        <tbody>
          <tr><td><code>rawrsa</code></td><td>a raw RSA signature + the signer cert</td><td><code>atick.embed_rawrsa</code></td></tr>
          <tr><td><code>pkcs7</code></td><td>a CMS, signer cert only (no revocation)</td><td><code>atick.embed</code></td></tr>
          <tr><td><code>pkcs7Pdf</code></td><td>a CMS, full chain + CRL/OCSP (signed attr) + timestamp</td><td><code>atick.embed</code></td></tr>
          <tr><td><code>pkcs7complete</code></td><td>a CMS, full chain + revocation (unsigned attr)</td><td><code>atick.embed</code></td></tr>
        </tbody>
      </table>

      <h2>Simulating the ESP for testing</h2>
      <p><code>atick.cms_pfx(data, pfx, pw, revocation=True, timestamp=True)</code> produces a
      <code>pkcs7Pdf</code>-style CMS, and <code>atick.sign_hash_pfx(data, pfx, pw)</code> a
      <code>rawrsa</code> response — so you can run the whole flow end-to-end without a live ESP. See
      <code>examples/esign/</code>.</p>

      <h2>Command line</h2>
      <Code lang="bash" file="esign_cli.sh" code={`atick esign-prepare in.pdf prepared.pdf --certify form-annots   # prints the InputHash
# sign the request XML (managex-xml-sdk) + POST to the ESP, save the response
atick esign-embed prepared.pdf response.xml signed.pdf`} />

      <p><a href="/docs/python/api/">Next page →</a></p>
    </DocsShell>
  );
}
