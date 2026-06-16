import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="node" section="install">
      <h1>Installation</h1>
      <p>ATick for Node.js is one self-contained npm package with a prebuilt binary — no
      <code>node-gyp</code>, no compiler, no build step.</p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js 10.16 or newer</strong> — the prebuilt binary is ABI-stable across all Node versions.</li>
        <li>Any supported OS/arch — Windows 7+ (x64/x86/ARM64), Linux (x64/ARM64/ARM, every glibc distro), macOS (Intel/Apple Silicon).</li>
      </ul>

      <h2>Install</h2>
      <Code lang="node" file="install.sh" code={`npm install atick`} />
      <Code lang="node" file="install-alt.sh" code={`# yarn / pnpm
yarn add atick
pnpm add atick`} />

      <h2>Verify</h2>
      <Code lang="node" file="verify.js" code={`const atick = require("atick");
console.log(atick.version());   // e.g. 1.0.6`} />

      <h2>How the prebuilt binary is loaded</h2>
      <p>The package ships a prebuilt binary for each platform under
      <code>prebuilds/&lt;platform&gt;-&lt;arch&gt;/</code>. At <code>require(&quot;atick&quot;)</code>,
      the right one is loaded for <code>process.platform</code> + <code>process.arch</code> — there is
      no compilation on install.</p>

      <p><a href="/docs/node/signing/">Next page →</a></p>
    </DocsShell>
  );
}
