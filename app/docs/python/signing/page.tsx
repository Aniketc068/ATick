import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="python" section="signing">
      <h1>Signing methods</h1>

      <p>ATick signs with three kinds of key holders. All three take the same options.</p>

      <h2>1. PFX / P12 / PEM file</h2>
      <Code lang="python" file="sign_pfx.py" code={`atick.sign_pfx(pdf, pfx=pfx_bytes, password="••••", style=style, placements=placements)`} />

      <p><code>sign_pfx</code> accepts both <strong>PKCS#12</strong> (<code>.pfx</code>/<code>.p12</code>)
      and <strong>PEM</strong> — an unencrypted PKCS#8/PKCS#1 private key plus one or more
      <code>CERTIFICATE</code> blocks. The format is auto-detected, so a PEM works in the same call
      (pass its bytes as <code>pfx=</code> and <code>password=&quot;&quot;</code>):</p>
      <Code lang="python" file="sign_pem.py" code={`pem = open("signer.pem", "rb").read()
atick.sign_pfx(pdf, pfx=pem, password="", style=style, placements=placements)`} />

      <h2>2. USB token / smart-card / HSM (PKCS#11)</h2>
      <Code lang="python" file="sign_pkcs11.py" code={`for serial, name in atick.pkcs11_list(dll="C:/Windows/System32/eps2003csp11.dll", pin="••••"):
    print(serial, name)

atick.sign_pkcs11(pdf, dll=".../lib.dll", pin="••••", serial="<hex serial>",
                  style=style, placements=placements)`} />

      <p>The vendor PKCS#11 library (<code>.dll</code>/<code>.so</code>/<code>.dylib</code>) is loaded
      at run time — no C toolchain needed.</p>

      <h2>3. Windows certificate store</h2>
      <Code lang="python" file="sign_winstore.py" code={`atick.sign_winstore(pdf, style=style, placements=placements)                 # opens the certificate picker
atick.sign_winstore(pdf, style=style, placements=placements, thumbprint="<hex>")   # pick by thumbprint`} />

      <h2>Common options</h2>
      <table>
        <thead>
          <tr><th>Option</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>pades=True</code></td><td>PAdES (<code>ETSI.CAdES.detached</code>); <code>False</code> → plain CMS (<code>adbe.pkcs7.detached</code>)</td></tr>
          <tr><td><code>hash_algo=&quot;sha256&quot;</code></td><td><code>&quot;sha256&quot;</code>, <code>&quot;sha384&quot;</code>, <code>&quot;sha512&quot;</code> (signature is RSA PKCS#1 v1.5)</td></tr>
          <tr><td><code>timestamp=True</code></td><td>add an RFC-3161 signature timestamp (B-T)</td></tr>
          <tr><td><code>tsa_url=</code>, <code>tsa_auth=(user, pass)</code></td><td>choose / authenticate the timestamp authority</td></tr>
          <tr><td><code>ltv=True</code></td><td>embed long-term validation (B-LT)</td></tr>
          <tr><td><code>lta=True</code></td><td>add a document timestamp (B-LTA)</td></tr>
          <tr><td><code>certify=</code>, <code>lock_fields=</code></td><td><a href="/docs/python/certification/">certification &amp; locking</a></td></tr>
          <tr><td><code>verify=True</code>, <code>trusted_roots=[sha1, …]</code></td><td>pre-sign expiry / CRL / OCSP / chain checks</td></tr>
          <tr><td><code>field_name=&quot;…&quot;</code></td><td>the signature field name (auto-uniquified — <code>Atick_1</code>, <code>Atick_2</code>, …)</td></tr>
          <tr><td><code>mode=&quot;single&quot; | &quot;shared&quot;</code></td><td>one signature on many pages, or many fields sharing one value</td></tr>
        </tbody>
      </table>

      <p><code>sign_pfx</code> additionally accepts <code>open_password=</code> (decrypt an encrypted
      input), <code>encrypt_password=</code> and <code>owner_password=</code> (password-protect the
      output).</p>

      <h2>Multi-signatory (sign an already-signed PDF)</h2>
      <p>ATick signs as an <strong>incremental update</strong>: existing signatures keep their byte
      ranges and stay valid. Just sign the already-signed PDF again; the field name is
      auto-uniquified so it never collides.</p>
      <Code lang="python" file="multi_sign.py" code={`signed_v1 = atick.sign_pfx(pdf,       pfx=pfx, password="••••", style=style, placements=placements)   # Atick_1
signed_v2 = atick.sign_pfx(signed_v1, pfx=pfx, password="••••", style=style, placements=placements)   # Atick_2`} />

      <p><a href="/docs/python/pades/">Next page →</a></p>
    </DocsShell>
  );
}
