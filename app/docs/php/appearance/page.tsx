import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Appearance · PHP', description: 'Customize the signature appearance in ATick for PHP — Adobe-style validity green tick, logo, text, colours and layout.', alternates: { canonical: '/docs/php/appearance/' } };

export default function Page() {
  return (
    <DocsShell lang="php" section="appearance">
      <h1>Appearance</h1>
      <p>The signature appearance is controlled entirely by option keys passed to
      <code> Atick::signPfx($pdf, $pfx, $options)</code>. By default ATick shows its logo on the
      left, the signer details on the right, and the validity mark.</p>
      <Code lang="php" file="appearance.php" code={`require 'vendor/autoload.php';
use Aniketc068\\ATick\\Atick;

$pdf = file_get_contents("doc.pdf");
$pfx = file_get_contents("my.pfx");

$signed = Atick::signPfx($pdf, $pfx, [
    "cn"         => "Axonate Tech",   // common name (shown bold after "Digitally Signed by:")
    "org"        => "Acme Corp",           // organisation line
    "reason"     => "Approved",            // "Reason: …"
    "location"   => "New Delhi",           // "Location: …"
    "green_tick" => true,
]);

file_put_contents("signed.pdf", $signed);`} />
      <p>Long signer names <strong>wrap</strong> onto more lines instead of shrinking the font, so the box never overflows.</p>

      <h2>Date / time</h2>
      <Code lang="php" file="date.php" code={`Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech"]);                                  // current time (default)
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "date" => "Signed on 10-Jun-2026"]); // a fixed string
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "date" => ""]);                    // no date line`} />

      <h2>The left side</h2>
      <p>The <code>image</code> key controls what is drawn on the left of the appearance:</p>
      <Code lang="php" file="image.php" code={`Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech"]);                    // default: the ATick logo
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "image" => "none"]); // no logo
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "image" => "cn"]);   // the CN as large text on the LEFT (Adobe-style)`} />
      <table>
        <thead>
          <tr><th><code>image</code> value</th><th>Result</th></tr>
        </thead>
        <tbody>
          <tr><td>omitted</td><td>the default ATick logo</td></tr>
          <tr><td><code>&quot;none&quot;</code></td><td>no logo on the left</td></tr>
          <tr><td><code>&quot;cn&quot;</code></td><td>the signer name as text on the left instead of a logo</td></tr>
        </tbody>
      </table>

      <h2>The validity mark — ATick&apos;s signature look</h2>
      <p>The mark sits centred in the appearance and tells the reader the signature&apos;s status at a glance:</p>
      <Code lang="php" file="mark.php" code={`Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => true]);    // the "?" mark — Adobe paints it GREEN if valid+trusted, RED if invalid
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "always_check" => true]);  // ATick's green-tick graphic as the base (Adobe still reds a bad signature)
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => false]);   // no mark — a plain signature`} />
      <ul>
        <li><strong><code>green_tick =&gt; true</code></strong> — the classic validity mark: a <code>?</code> that Adobe Acrobat repaints <strong>green</strong>
        for a valid, trusted signature and <strong>red</strong> for a broken one.</li>
        <li><strong><code>always_check =&gt; true</code></strong> — uses ATick&apos;s own green-tick graphic as the base, so the tick
        shows in every viewer; Adobe still overlays a red mark if the signature is actually invalid.</li>
        <li><strong><code>green_tick =&gt; false</code></strong> — no mark; a plain signature appearance.</li>
      </ul>

      <h3>How Adobe shows it</h3>
      <p>When the certificate is valid and trusted, <strong>Adobe Reader / Acrobat reports &ldquo;Signed and all
      signatures are valid&rdquo;</strong> and paints the tick green — exactly the reassurance your readers expect.</p>

      <h3>Every state Adobe can show</h3>
      <p>ATick draws the appearance and the mark; <strong>Adobe then colours the mark based on the signature&apos;s
      validity and whether it trusts the certificate</strong>, so your reader instantly sees the status:</p>
      <ul>
        <li><strong>Valid &amp; trusted</strong> — signature intact <strong>and</strong> the certificate chains to a root Adobe trusts — <em>&quot;Signed and all signatures are valid.&quot;</em></li>
        <li><strong>Validity unknown</strong> — signature intact, but Adobe <strong>doesn&apos;t trust the certificate&apos;s root</strong> — <em>&quot;Validity unknown.&quot;</em></li>
        <li><strong>Not verified</strong> — Adobe <strong>hasn&apos;t validated</strong> the signature yet (no trust information) — <em>&quot;Signature not verified.&quot;</em></li>
        <li><strong>Invalid</strong> — the document was <strong>changed after signing</strong> (or the signature is broken) — <em>&quot;Signature is invalid.&quot;</em></li>
      </ul>
      <p>So the <strong>green</strong> tick appears only when the signature is valid <em>and</em> the signer&apos;s certificate chains
      to a root Adobe trusts (the Adobe Approved Trust List, or your organisation&apos;s trust). The same ATick
      appearance shows the question-mark or red-cross state automatically — you don&apos;t draw those; Adobe does.</p>

      <h3>Colouring the mark</h3>
      <p>Colour the mark with a hex string, a CSS colour name, or an <code>[r, g, b]</code> array — or fill it with an
      axial gradient:</p>
      <Code lang="php" file="color.php" code={`Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => true, "mark_color" => "#E53935"]);        // hex
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => true, "mark_color" => "blue"]);           // CSS name
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => true, "mark_color" => [255, 140, 0]]);    // RGB array
Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "green_tick" => true, "mark_gradient" => ["red", "orange", "yellow"]]);  // gradient`} />
      <p>Use <code>mark_scale</code> to resize the mark relative to the appearance box.</p>

      <h2>Distinguished name</h2>
      <Code lang="php" file="dn.php" code={`Atick::signPfx($pdf, $pfx, [
    "cn" => "Axonate Tech",
    "dn" => "CN=Axonate Tech, O=Personal, C=IN",
]);`} />
      <p>The DN is shown directly under the &quot;Digitally Signed by:&quot; line.</p>

      <h2>Custom-text-only appearance</h2>
      <p>Show <strong>only</strong> your own text — no &quot;Signed by&quot;, no date, no CN structure. Inside <code>body</code>, <code>\n</code> starts a
      new line and <code>*word*</code> makes that run <strong>bold</strong>:</p>
      <Code lang="php" file="body.php" code={`Atick::signPfx($pdf, $pfx, [
    "body" => "*APPROVED*\\nReviewed by: *Axonate Tech*\\nThis document is *legally binding*.",
]);`} />
      <blockquote>In a PHP <strong>double-quoted</strong> string, <code>\n</code> is a real newline character — use double quotes for <code>body</code>
      (single-quoted strings leave <code>\n</code> literal). ATick reads each newline as a line break.</blockquote>

      <h2>Positioning the appearance</h2>
      <p>Place the appearance with <code>page</code> + <code>rect</code>, or stamp several positions at once with <code>placements</code>.
      Coordinates are PDF points as <code>[x1, y1, x2, y2]</code>.</p>
      <Code lang="php" file="position.php" code={`Atick::signPfx($pdf, $pfx, [
    "cn" => "Axonate Tech", "green_tick" => true, "page" => 1, "rect" => [300, 55, 575, 175],
]);

// one stamp per entry: [page, [x1,y1,x2,y2]]
Atick::signPfx($pdf, $pfx, [
    "cn" => "Axonate Tech", "green_tick" => true,
    "placements" => [[1, [300, 55, 575, 175]], [2, [300, 55, 575, 175]]],
]);`} />
      <p>You can also size the box directly with <code>width</code> and <code>height</code>.</p>

      <h2>Fine-tuning the layout</h2>
      <p>Once the box is placed you can nudge the mark, the logo region, and the text independently —
      useful for matching an exact house style without recomputing the rectangle.</p>
      <Code lang="php" file="tune.php" code={`Atick::signPfx($pdf, $pfx, [
    "cn"          => "Axonate Tech",
    "green_tick"  => true,
    "top_reserve" => 0.32,        // fraction of the box height reserved at the top for the logo / mark
    "mark_scale"  => 1.15,        // scale the mark up (1.0 = default)
    "mark_dx"     => 4,           // nudge the mark right (PDF points; negative = left)
    "mark_dy"     => -2,          // nudge the mark down (negative = up)
    "text_dx"     => 6,           // nudge the signer text horizontally
    "text_top"    => 0.5,         // vertical start of the text block (fraction of box height)
]);`} />
      <table>
        <thead>
          <tr><th>Key</th><th>Type</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>top_reserve</code></td><td>number (0–1)</td><td>Fraction of the box height reserved at the top for the logo / validity mark.</td></tr>
          <tr><td><code>mark_scale</code></td><td>number</td><td>Scale factor for the mark (<code>1.0</code> = default).</td></tr>
          <tr><td><code>mark_dx</code></td><td>number</td><td>Nudge the mark horizontally in PDF points (negative = left).</td></tr>
          <tr><td><code>mark_dy</code></td><td>number</td><td>Nudge the mark vertically in PDF points (negative = up).</td></tr>
          <tr><td><code>text_dx</code></td><td>number</td><td>Nudge the signer text horizontally in PDF points.</td></tr>
          <tr><td><code>text_top</code></td><td>number</td><td>Vertical start of the text block (fraction of the box height).</td></tr>
        </tbody>
      </table>

      <h3>Border colour &amp; width</h3>
      <p>With <code>border =&gt; true</code> you can set the border&apos;s colour and thickness:</p>
      <Code lang="php" file="border.php" code={`Atick::signPfx($pdf, $pfx, [
    "cn"           => "Axonate Tech",
    "border"       => true,
    "border_color" => [0, 102, 204],   // [r, g, b] (0–255)
    "border_width" => 1.0,             // line width in PDF points
]);`} />
      <table>
        <thead>
          <tr><th>Key</th><th>Type</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>border</code></td><td>bool</td><td>Draw a border around the appearance box.</td></tr>
          <tr><td><code>border_color</code></td><td><code>[r, g, b]</code></td><td>Border colour (each channel 0–255). Requires <code>border =&gt; true</code>.</td></tr>
          <tr><td><code>border_width</code></td><td>number</td><td>Border line width in PDF points (default <code>1.0</code>).</td></tr>
        </tbody>
      </table>

      <h2>Invisible signature</h2>
      <p>A cryptographically valid signature that draws nothing on the page — pass an empty <code>placements</code>
      array:</p>
      <Code lang="php" file="invisible.php" code={`Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "placements" => []]);   // empty placements`} />

      <h2>Other appearance options</h2>
      <table>
        <thead>
          <tr><th>Key</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>heading</code></td><td>the heading line at the top of the appearance</td></tr>
          <tr><td><code>text</code></td><td>extra free text line</td></tr>
          <tr><td><code>ou</code></td><td>organisational-unit line</td></tr>
          <tr><td><code>font_size</code></td><td>size of the appearance text</td></tr>
          <tr><td><code>text_color</code></td><td>colour of the text</td></tr>
          <tr><td><code>bg_color</code></td><td>background fill of the box</td></tr>
          <tr><td><code>border</code></td><td>draw a border around the box</td></tr>
          <tr><td><code>border_color</code>, <code>border_width</code></td><td>border colour <code>[r,g,b]</code> and line width (with <code>border =&gt; true</code>)</td></tr>
          <tr><td><code>width</code>, <code>height</code></td><td>the box size</td></tr>
          <tr><td><code>top_reserve</code></td><td>fraction of box height reserved at the top for the logo / mark</td></tr>
          <tr><td><code>mark_scale</code></td><td>scale factor for the validity mark</td></tr>
          <tr><td><code>mark_dx</code>, <code>mark_dy</code></td><td>nudge the mark horizontally / vertically (PDF points)</td></tr>
          <tr><td><code>text_dx</code>, <code>text_top</code></td><td>nudge the signer text horizontally / set its vertical start</td></tr>
        </tbody>
      </table>

      <h2>Errors</h2>
      <p>Every failure throws an <code>Aniketc068\ATick\AtickException</code>:</p>
      <Code lang="php" file="errors.php" code={`try {
    Atick::signPfx($pdf, $pfx, ["cn" => "Axonate Tech", "image" => "missing.png"]);
} catch (\\Aniketc068\\ATick\\AtickException $e) {
    echo "signing failed: " . $e->getMessage();
}`} />

      <p><a href="/docs/php/certification/">Next page →</a></p>
    </DocsShell>
  );
}
