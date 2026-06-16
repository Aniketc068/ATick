import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'ATick for Node.js · Node.js', description: 'Get started with ATick — standalone PDF digital signatures for Node.js: PAdES/CMS, RFC-3161 timestamps, LTV and an Adobe-valid green-tick signature appearance.', alternates: { canonical: '/docs/node/' } };

export default function Page() {
  return (
    <DocsShell lang="node" section="">
      <h1>ATick for Node.js</h1>
      <p>Standalone PDF digital-signature library for Node.js — PAdES &amp; CMS signing with a PFX/PEM
      file, deferred eSign/HSM/token signing, RFC-3161 timestamps, long-term validation and a
      green-tick appearance Adobe shows as valid. Prebuilt native addon, runs server-side.</p>
      <blockquote>Install: <code>npm install atick</code></blockquote>
      <h2>Sign in one call</h2>
      <Code lang="node" file="sign.js" code={`const atick = require("atick");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••", cn: "Axonate Tech", reason: "Approved",
  page: 1, rect: [300, 55, 575, 175],
  pades: true, timestamp: true, ltv: true,   // PAdES-B-LT
}));`} />
      <p><a href="/docs/node/quickstart/">Quickstart →</a></p>
    </DocsShell>
  );
}
