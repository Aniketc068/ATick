import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Quickstart · Node.js', description: 'Sign your first PDF with ATick for Node.js in a few lines — PAdES signature, timestamp and an Adobe-valid green-tick appearance.', alternates: { canonical: '/docs/node/quickstart/' } };

export default function Page() {
  return (
    <DocsShell lang="node" section="quickstart">
      <h1>Quickstart</h1>
      <p>Sign a PDF with a <code>.pfx</code> (or <code>.p12</code> / <code>.pem</code>) and a visible
      green-tick appearance.</p>
      <Code lang="node" file="quickstart.js" code={`const atick = require("atick");
const fs = require("fs");

const pdf = fs.readFileSync("doc.pdf");
const pfx = fs.readFileSync("my.pfx");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••", cn: "Axonate Tech", reason: "Approved",
  green_tick: true, page: 1, rect: [300, 55, 575, 175],
  pades: true, timestamp: true, ltv: true,           // PAdES-B-LT
}));

fs.writeFileSync("signed.pdf", signed);`} />
      <p>Open <code>signed.pdf</code> in Adobe Reader — for a trusted certificate it shows a valid
      green tick and <strong>&ldquo;Signed and all signatures are valid.&rdquo;</strong></p>

      <h2>TypeScript</h2>
      <Code lang="node" file="quickstart.ts" code={`import * as atick from "atick";
import { readFileSync, writeFileSync } from "fs";

const signed = atick.signPfx(readFileSync("doc.pdf"), readFileSync("my.pfx"),
  JSON.stringify({ password: "••••", cn: "Aniket", pades: true, page: 1, rect: [300, 55, 575, 175] }));
writeFileSync("signed.pdf", signed);`} />

      <h2>A minimal, invisible signature</h2>
      <Code lang="node" file="invisible.js" code={`const signed = atick.signPfx(pdf, pfx, JSON.stringify({ password: "••••", placements: [], pades: true }));`} />

      <h2>Catching errors</h2>
      <Code lang="node" file="catch.js" code={`try {
  atick.signPfx(pdf, pfx, JSON.stringify({ password: "wrong" }));
} catch (e) {
  console.error("signing failed:", e.message);
}`} />

      <p>Next: see Signing for all the options, or the API reference.</p>
      <p><a href="/docs/node/install/">Next page →</a></p>
    </DocsShell>
  );
}
