import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Installation · Python', description: 'Install ATick for Python — supported platforms, package manager and requirements.', alternates: { canonical: '/docs/python/install/' } };

export default function Page() {
  return (
    <DocsShell lang="python" section="install">
      <h1>Installation</h1>

      <Code lang="bash" file="install.sh" code={`pip install atick`} />

      <p>That is all — ATick has <strong>no other dependencies</strong>. The cryptography,
      PFX/PKCS#12 parsing, PKCS#11 token access, image decoding, RFC-3161 timestamping and LTV are
      all built into the package.</p>

      <ul>
        <li><strong>Python</strong>: 3.8 or newer.</li>
        <li><strong>Platforms</strong>: Windows, macOS, Linux. Windows-store signing
        (<code>sign_winstore</code>) is Windows-only; everything else is cross-platform.</li>
        <li><strong>Optional</strong>: the Indian-eSign examples sign the request XML with the
        separate <code>managex-xml-sdk</code> package (<code>pip install managex-xml-sdk</code>).</li>
      </ul>

      <h2>Verify</h2>
      <Code lang="python" file="verify.py" code={`import atick
print(atick.__version__)`} />

      <Code lang="bash" file="verify.sh" code={`atick version`} />

      <p><a href="/docs/python/signing/">Next page →</a></p>
    </DocsShell>
  );
}
