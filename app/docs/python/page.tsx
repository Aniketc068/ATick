import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="python" section="">
      <h1>ATick for Python</h1>
      <p>The standalone PDF digital-signature library for Python — PAdES &amp; CMS signing with a
      PFX/PEM file, USB tokens (PKCS#11), the Windows certificate store and Indian eSign, with
      RFC-3161 timestamps, long-term validation and a green-tick appearance Adobe shows as valid.
      Zero dependencies.</p>
      <blockquote>Install with <code>pip install atick</code> — one self-contained package.</blockquote>
      <h2>Sign in one call</h2>
      <Code lang="python" file="sign.py" code={`import atick

signed = atick.sign_pfx(
    open("doc.pdf", "rb").read(),
    pfx=open("my.pfx", "rb").read(), password="••••",
    style=atick.Style(cn="Aniket Chaturvedi", reason="Approved"),
    placements=[(1, (300, 55, 575, 175))],
    pades=True, timestamp=True, ltv=True,   # PAdES-B-LT
)
open("signed.pdf", "wb").write(signed)`} />
      <h2>What&apos;s inside</h2>
      <ul>
        <li><strong>Sign anywhere</strong> — <code>.pfx</code>/<code>.p12</code>/<code>.pem</code>, USB tokens, the Windows store and CCA eSign.</li>
        <li><strong>Full PAdES</strong> — B-B, B-T, B-LT, B-LTA with timestamps and long-term validation.</li>
        <li><strong>Certify &amp; lock</strong> — DocMDP, field-locking, pre-sign CRL/OCSP checks, encryption.</li>
        <li><strong>Rich appearance</strong> — logo or CN, the validity mark, custom text, invisible signatures.</li>
      </ul>
      <p><a href="/docs/python/quickstart/">Quickstart →</a></p>
    </DocsShell>
  );
}
