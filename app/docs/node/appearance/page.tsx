import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Appearance · Node.js', description: 'Customize the signature appearance in ATick for Node.js — Adobe-style validity green tick, logo, text, colours and layout.', alternates: { canonical: '/docs/node/appearance/' } };

export default function Page() {
  return (
    <DocsShell lang="node" section="appearance">
      <h1>Appearance</h1>
      <p>The signature appearance is controlled entirely by JSON option keys passed to
      <code>atick.signPfx(pdf, pfx, optionsJson)</code>. By default ATick shows its logo on the left,
      the signer details on the right, and the validity mark.</p>
      <Code lang="node" file="appearance.js" code={`const atick = require("atick");
const fs = require("fs");

const pdf = fs.readFileSync("doc.pdf");
const pfx = fs.readFileSync("my.pfx");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Axonate Tech",   // common name (shown bold after "Digitally Signed by:")
  org: "Acme Corp",          // organisation line
  reason: "Approved",        // "Reason: …"
  location: "New Delhi",     // "Location: …"
  green_tick: true,
}));

fs.writeFileSync("signed.pdf", signed);`} />
      <p>Long signer names <strong>wrap</strong> onto more lines instead of shrinking the font, so the
      box never overflows.</p>

      <h2>Date / time</h2>
      <Code lang="node" file="date.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket" }));                              // current time (default)
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", date: "Signed on 10-Jun-2026" })); // a fixed string
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", date: "" }));                    // no date line`} />

      <h2>The left side</h2>
      <p>The <code>image</code> key controls what is drawn on the left of the appearance:</p>
      <Code lang="node" file="left.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket" }));                  // default: the ATick logo
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", image: "none" }));   // no logo
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", image: "cn" }));     // the CN as large text on the LEFT (Adobe-style)`} />
      <table>
        <thead><tr><th><code>image</code> value</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>omitted</td><td>the default ATick logo</td></tr>
          <tr><td><code>&quot;none&quot;</code></td><td>no logo on the left</td></tr>
          <tr><td><code>&quot;cn&quot;</code></td><td>the signer name as text on the left instead of a logo</td></tr>
        </tbody>
      </table>

      <h2>The validity mark — ATick&apos;s signature look</h2>
      <p>The mark sits centred in the appearance and tells the reader the signature&apos;s status at a
      glance:</p>
      <Code lang="node" file="mark.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: true }));    // the "?" mark — Adobe paints it GREEN if valid+trusted, RED if invalid
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", always_check: true }));  // ATick's green-tick graphic as the base (Adobe still reds a bad signature)
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: false }));   // no mark — a plain signature`} />
      <ul>
        <li><strong><code>green_tick: true</code></strong> — the classic validity mark: a <code>?</code> that Adobe Acrobat repaints <strong>green</strong> for a valid, trusted signature and <strong>red</strong> for a broken one.</li>
        <li><strong><code>always_check: true</code></strong> — uses ATick&apos;s own green-tick graphic as the base, so the tick shows in every viewer; Adobe still overlays a red mark if the signature is actually invalid.</li>
        <li><strong><code>green_tick: false</code></strong> — no mark; a plain signature appearance.</li>
      </ul>

      <h3>How Adobe shows it</h3>
      <p>When the certificate is valid and trusted, <strong>Adobe Reader / Acrobat reports
      &ldquo;Signed and all signatures are valid&rdquo;</strong> and paints the tick green — exactly the
      reassurance your readers expect.</p>

      <h3>Every state Adobe can show</h3>
      <p>ATick draws the appearance and the mark; <strong>Adobe then colours the mark based on the
      signature&apos;s validity and whether it trusts the certificate</strong>, so your reader instantly
      sees the status:</p>
      <ul>
        <li><strong>Valid &amp; trusted</strong> — signature intact <strong>and</strong> the certificate chains to a root Adobe trusts — <em>&ldquo;Signed and all signatures are valid.&rdquo;</em></li>
        <li><strong>Validity unknown</strong> — signature intact, but Adobe <strong>doesn&apos;t trust the certificate&apos;s root</strong> — <em>&ldquo;Validity unknown.&rdquo;</em></li>
        <li><strong>Not verified</strong> — Adobe <strong>hasn&apos;t validated</strong> the signature yet (no trust information) — <em>&ldquo;Signature not verified.&rdquo;</em></li>
        <li><strong>Invalid</strong> — the document was <strong>changed after signing</strong> (or the signature is broken) — <em>&ldquo;Signature is invalid.&rdquo;</em></li>
      </ul>
      <p>So the <strong>green</strong> tick appears only when the signature is valid <em>and</em> the
      signer&apos;s certificate chains to a root Adobe trusts (the Adobe Approved Trust List, or your
      organisation&apos;s trust). The same ATick appearance shows the question-mark or red-cross state
      automatically — you don&apos;t draw those; Adobe does.</p>

      <h3>Colouring the mark</h3>
      <p>Colour the mark with a hex string, a CSS colour name, or an <code>[r, g, b]</code> array — or
      fill it with an axial gradient:</p>
      <Code lang="node" file="mark-color.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: true, mark_color: "#E53935" }));        // hex
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: true, mark_color: "blue" }));           // CSS name
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: true, mark_color: [255, 140, 0] }));    // RGB array
atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", green_tick: true, mark_gradient: ["red", "orange", "yellow"] }));  // gradient`} />
      <p>Use <code>mark_scale</code> to resize the mark relative to the appearance box.</p>

      <h2>Distinguished name</h2>
      <Code lang="node" file="dn.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Axonate Tech",
  dn: "CN=Axonate Tech, O=Personal, C=IN",
}));`} />
      <p>The DN is shown directly under the &quot;Digitally Signed by:&quot; line.</p>

      <h2>Custom-text-only appearance</h2>
      <p>Show <strong>only</strong> your own text — no &quot;Signed by&quot;, no date, no CN structure.
      Inside <code>body</code>, <code>\n</code> starts a new line and <code>*word*</code> makes that run
      <strong>bold</strong>:</p>
      <Code lang="node" file="body.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({
  body: "*APPROVED*\\nReviewed by: *Axonate Tech*\\nThis document is *legally binding*.",
}));`} />
      <blockquote>In a JavaScript string literal, <code>\n</code> is a real newline character.
      <code>JSON.stringify</code> then encodes it correctly inside the JSON, and ATick reads it as a
      line break.</blockquote>

      <h2>Positioning the appearance</h2>
      <p>Place the appearance with <code>page</code> + <code>rect</code>, or stamp several positions at
      once with <code>placements</code>. Coordinates are PDF points as <code>[x1, y1, x2, y2]</code>.</p>
      <Code lang="node" file="position.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Aniket", green_tick: true, page: 1, rect: [300, 55, 575, 175],
}));

// one stamp per entry: [page, [x1,y1,x2,y2]]
atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Aniket", green_tick: true,
  placements: [[1, [300, 55, 575, 175]], [2, [300, 55, 575, 175]]],
}));`} />
      <p>You can also size the box directly with <code>width</code> and <code>height</code>.</p>

      <h2>Fine-tuning the layout</h2>
      <p>When the default placement is close but not exact, nudge the pieces individually instead of
      redesigning the box. All offsets are in PDF points unless noted.</p>
      <Code lang="node" file="fine-tune.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Aniket", green_tick: true,
  top_reserve: 0.32,   // reserve the top 32% of the box for the logo / mark
  mark_scale: 1.2,     // make the mark 20% larger
  mark_dx: 4,          // nudge the mark right
  mark_dy: -2,         // nudge the mark down
  text_dx: 6,          // nudge the signer text right
  text_top: 4,         // push the text down from the top
}));`} />
      <ul>
        <li><strong><code>top_reserve</code></strong> — fraction (<code>0</code>–<code>1</code>) of the box height kept clear at the top for the logo or validity mark; raise it to give the mark more room above the text.</li>
        <li><strong><code>mark_scale</code></strong> — scale factor for the mark relative to the box; <strong><code>mark_dx</code></strong> / <strong><code>mark_dy</code></strong> shift it horizontally / vertically.</li>
        <li><strong><code>text_dx</code></strong> — horizontal shift of the signer text; <strong><code>text_top</code></strong> — vertical offset of the text from the top of the box.</li>
      </ul>

      <h3>Border colour &amp; width</h3>
      <p>With <code>border: true</code>, set the border colour and line width:</p>
      <Code lang="node" file="border.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({
  cn: "Aniket", green_tick: true,
  border: true,
  border_color: [33, 150, 243],   // [r, g, b] (also accepts hex or a CSS name)
  border_width: 1.0,              // line width in PDF points
}));`} />
      <ul>
        <li><strong><code>border_color</code></strong> — a hex string, a CSS colour name, or an <code>[r, g, b]</code> array.</li>
        <li><strong><code>border_width</code></strong> — border line width in PDF points (e.g. <code>1.0</code>).</li>
      </ul>

      <h2>Invisible signature</h2>
      <p>A cryptographically valid signature that draws nothing on the page — pass an empty
      <code>placements</code> array:</p>
      <Code lang="node" file="invisible.js" code={`atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", placements: [] }));   // empty placements`} />

      <h2>Other appearance options</h2>
      <table>
        <thead><tr><th>Key</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>heading</code></td><td>the heading line at the top of the appearance</td></tr>
          <tr><td><code>text</code></td><td>extra free text line</td></tr>
          <tr><td><code>ou</code></td><td>organisational-unit line</td></tr>
          <tr><td><code>font_size</code></td><td>size of the appearance text</td></tr>
          <tr><td><code>text_color</code></td><td>colour of the text</td></tr>
          <tr><td><code>bg_color</code></td><td>background fill of the box</td></tr>
          <tr><td><code>border</code></td><td>draw a border around the box</td></tr>
          <tr><td><code>border_color</code></td><td>border colour (hex / name / <code>[r,g,b]</code>) — used with <code>border: true</code></td></tr>
          <tr><td><code>border_width</code></td><td>border line width in PDF points</td></tr>
          <tr><td><code>width</code>, <code>height</code></td><td>the box size</td></tr>
          <tr><td><code>top_reserve</code></td><td>top fraction (0–1) reserved for the logo / mark</td></tr>
          <tr><td><code>mark_scale</code></td><td>scale factor for the validity mark</td></tr>
          <tr><td><code>mark_dx</code>, <code>mark_dy</code></td><td>nudge the mark horizontally / vertically (PDF points)</td></tr>
          <tr><td><code>text_dx</code>, <code>text_top</code></td><td>nudge the signer text horizontally / from the top (PDF points)</td></tr>
        </tbody>
      </table>

      <h2>Errors</h2>
      <p>Every failure throws an <code>Error</code>:</p>
      <Code lang="node" file="errors.js" code={`try {
  atick.signPfx(pdf, pfx, JSON.stringify({ cn: "Aniket", image: "missing.png" }));
} catch (err) {
  console.log("signing failed: " + err.message);
}`} />

      <p><a href="/docs/node/certification/">Next page →</a></p>
    </DocsShell>
  );
}
