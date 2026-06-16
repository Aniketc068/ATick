import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="python" section="api">
      <h1>API reference</h1>

      <p>All functions raise <code>atick.AtickError</code> on failure.</p>

      <h2>Signing</h2>
      <Code lang="python" file="sign_pfx_sig.py" code={`atick.sign_pfx(pdf, *, pfx, password, style, placements, mode="single",
    field_name="Atick_1", pades=True, hash_algo="sha256", timestamp=False,
    tsa_url=None, tsa_auth=None, ltv=False, lta=False, doc_tsa_url=None,
    doc_tsa_auth=None, reason=None, location=None, signing_time=None,
    signer_name=None, contents_size=0, certify=0, lock_fields=[], verify=False,
    trusted_roots=[], open_password=None, encrypt_password=None,
    owner_password=None, embed_revocation=True)`} />
      <p>Sign <code>pdf</code> (bytes) with a PFX/P12. Returns the signed PDF (bytes).</p>

      <p>Besides <code>verify=True</code> (which runs every pre-sign check and refuses to sign on
      failure), you can enable the individual checks:</p>
      <ul>
        <li><code>verify_expiry=True</code> — refuse to sign if the signing certificate has expired /
        is not yet valid.</li>
        <li><code>verify_crl=True</code> — pre-sign CRL revocation check (refuse if revoked).</li>
        <li><code>verify_ocsp=True</code> — pre-sign OCSP revocation check.</li>
        <li><code>trusted_roots=[der, ...]</code> — extra trusted root certificates (DER bytes) for
        the checks.</li>
      </ul>
      <Code lang="python" file="sign_pfx_checks.py" code={`atick.sign_pfx(pdf, pfx, pw, style=..., placements=...,
    verify_expiry=True, verify_crl=True, verify_ocsp=True)`} />

      <Code lang="python" file="sign_pkcs11_sig.py" code={`atick.sign_pkcs11(pdf, *, dll, pin, serial, style, placements, ...)`} />
      <p>Sign with a PKCS#11 token / smart-card / HSM. Same options as <code>sign_pfx</code> (no
      PFX/encryption args).</p>

      <Code lang="python" file="sign_winstore_sig.py" code={`atick.sign_winstore(pdf, *, style, placements, thumbprint=None, ...)`} />
      <p>Sign with a certificate from the Windows store. <code>thumbprint=None</code> opens the
      certificate picker.</p>

      <Code lang="python" file="pkcs11_list_sig.py" code={`atick.pkcs11_list(dll, pin)`} />
      <p>Return <code>[(serial_hex, common_name), …]</code> for the certificates on a token.</p>

      <h2>Deferred / remote-key signing</h2>
      <Code lang="python" file="prepare_deferred_sig.py" code={`atick.prepare_deferred(pdf, style, *, page=1, rect=..., field_name="Atick_1",
    sub_filter="adbe.pkcs7.detached", ..., contents_size=16384, hash_algo="sha256")`} />
      <p>Add an empty signature field + appearance + container; returns
      <code>(prepared_pdf, ctx)</code> where <code>ctx[&quot;data&quot;]</code> are the bytes to sign
      and <code>ctx[&quot;digest&quot;]</code> their hash.</p>

      <Code lang="python" file="prepare_deferred_multi_sig.py" code={`atick.prepare_deferred_multi(pdf, style, placements, *, mode="single",
    field_name="Atick_1", sub_filter="adbe.pkcs7.detached", ..., certify=0, lock_fields=[])`} />
      <p>The multi-placement form (one signature, several pages). Returns
      <code>(prepared_pdf, ctx)</code>.</p>

      <Code lang="python" file="embed_sig.py" code={`atick.embed(prepared, cms_der)`} />
      <p>Embed a detached CMS/PKCS#7 into a prepared PDF. Returns the signed PDF.</p>

      <Code lang="python" file="embed_rawrsa_sig.py" code={`atick.embed_rawrsa(prepared, raw_sig, signer_cert, *, chain=[], hash_algo="sha256")`} />
      <p>Embed a raw RSA signature + signer certificate (e.g. an eSign <code>rawrsa</code> reply).</p>

      <Code lang="python" file="cms_pfx_sig.py" code={`atick.cms_pfx(data, pfx, password, *, hash_algo="sha256", pades=False,
    timestamp=False, tsa_url=None, tsa_auth=None, revocation=False)`} />
      <p>A detached CMS over <code>data</code> signed with a PFX. <code>revocation=True</code> adds
      the RevocationInfoArchival attribute (a <code>pkcs7Pdf</code>-style reply). Returns the CMS
      (bytes).</p>

      <Code lang="python" file="sign_hash_pfx_sig.py" code={`atick.sign_hash_pfx(data, pfx, password, *, hash_algo="sha256")`} />
      <p>A raw RSA signature over hash(<code>data</code>) with a PFX. Returns
      <code>(signature, signer_certificate_der)</code>.</p>

      <h2>Low-level field API</h2>
      <Code lang="python" file="prepare_sig.py" code={`atick.prepare(pdf, style, *, page=1, rect=..., field_name="Atick_1")`} />
      <p>Add ONE empty signature field with an appearance. Returns the PDF.</p>

      <Code lang="python" file="prepare_fields_sig.py" code={`atick.prepare_fields(pdf, styles, placements, names)`} />
      <p>Add SEVERAL empty fields at once (a template). Returns the PDF.</p>

      <Code lang="python" file="sign_field_sig.py" code={`atick.sign_field(pdf, field_name, *, sub_filter="adbe.pkcs7.detached", ...)`} />
      <p>Attach a container to an existing field by name; returns
      <code>(prepared_pdf, ctx)</code>.</p>

      <h2>Long-term validation &amp; timestamps</h2>
      <Code lang="python" file="add_ltv_sig.py" code={`atick.add_ltv(pdf, certs, crls=[], ocsps=[])`} />
      <p>Add the DSS (validation material) for the given certificates / revocation.</p>

      <Code lang="python" file="add_doctimestamp_sig.py" code={`atick.add_doctimestamp(pdf, *, tsa_url=None, tsa_auth=None, ltv=True, contents_size=16384)`} />
      <p>Append a document timestamp (RFC-3161) over the whole PDF (PAdES-B-LTA).
      <code>ltv=True</code> also adds the DSS (validation material) for the timestamp&apos;s
      certificate chain.</p>

      <h2>Documents &amp; utilities</h2>
      <Code lang="python" file="set_metadata_sig.py" code={`atick.set_metadata(pdf, *, title=None, author=None, subject=None, keywords=None,
    application=None, created=None, modified=None)`} />
      <p>Set the <code>/Info</code> metadata on an unsigned PDF.</p>

      <Code lang="python" file="decrypt_sig.py" code={`atick.decrypt(pdf, password)`} />
      <p>Decrypt a password-protected PDF; returns the plaintext PDF.</p>

      <Code lang="python" file="set_fast_signing_sig.py" code={`atick.set_fast_signing(on=True)`} />
      <p>Enable/disable the in-memory revocation cache (default on). Disabling also clears it.</p>

      <Code lang="python" file="clear_revocation_cache_sig.py" code={`atick.clear_revocation_cache()`} />
      <p>Forget all cached revocation.</p>

      <h2>Appearance</h2>
      <Code lang="python" file="style_sig.py" code={`atick.Style(cn="", org="", ou="", location=None, reason=None, text=None,
    date=None, heading="Digitally Signed by:", *, show_mark=True, dn=None,
    image=None, image_rect=None, body=None, green_tick=None, always_check=False,
    mark_color="#FFFF66", mark_gradient=None, font_size=None, text_color=(0, 0, 0),
    bg_color=None, border=False, ..., width=200, height=100)`} />
      <p>The verified-signature appearance. <code>image=&quot;cn&quot;</code> draws the CN on the
      left; <code>body=</code> is a custom-text-only appearance (<code>\\n</code> = line,
      <code>*x*</code> = bold); <code>green_tick=True</code> is the &quot;?&quot; mark,
      <code>always_check=True</code> the embedded green tick.</p>
      <p>Layout fine-tuning attributes:</p>
      <ul>
        <li><code>top_reserve=0.32</code> — fraction of the appearance box height reserved at the top
        for the logo / validity mark (raise it for a taller logo area).</li>
        <li><code>mark_scale</code>, <code>mark_dx</code>, <code>mark_dy</code> — scale and nudge
        (x / y offset) the validity mark.</li>
        <li><code>text_dx</code>, <code>text_top</code> — nudge the text block horizontally / set its
        top.</li>
        <li><code>border_color=(r, g, b)</code>, <code>border_width=1.0</code> — colour and width of
        the appearance border (with <code>border=True</code>).</li>
        <li><code>date_format=&quot;%d-%b-%Y %I:%M %p&quot;</code> — strftime format used when
        <code>date</code> is not given explicitly.</li>
      </ul>

      <Code lang="python" file="certify_sig.py" code={`atick.Certify`} />
      <p>Certification levels: <code>NONE</code> (0), <code>NO_CHANGES</code> (1),
      <code>FORM_FILLING</code> (2), <code>FORM_FILLING_ANNOTATIONS</code> (3).</p>

      <h2>Exceptions</h2>
      <Code lang="python" file="atickerror_sig.py" code={`atick.AtickError`} />
      <p>Raised for every failure (bad password, malformed PDF, network error, …).</p>
    </DocsShell>
  );
}
