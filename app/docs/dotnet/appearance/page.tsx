import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Appearance · .NET', description: 'Customize the signature appearance in ATick for .NET — Adobe-style validity green tick, logo, text, colours and layout.', alternates: { canonical: '/docs/dotnet/appearance/' } };

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="appearance">
      <h1>Appearance</h1>
      <p>The signature appearance is controlled entirely by JSON option keys passed to
      <code>Atick.SignPfx(byte[] pdf, byte[] pfx, string optionsJson)</code>. By default ATick shows
      its logo on the left, the signer details on the right, and the validity mark.</p>

      <Code lang="dotnet" file="Appearance.cs" code={`using Aniketc068.ATick;
using System.IO;

byte[] pdf = File.ReadAllBytes("doc.pdf");
byte[] pfx = File.ReadAllBytes("my.pfx");

byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Axonate Tech\\","   // common name (shown bold after "Digitally Signed by:")
  + "\\"org\\":\\"Acme Corp\\","            // organisation line
  + "\\"reason\\":\\"Approved\\","          // "Reason: …"
  + "\\"location\\":\\"New Delhi\\","       // "Location: …"
  + "\\"green_tick\\":true}");

File.WriteAllBytes("signed.pdf", signed);`} />

      <p>Long signer names <strong>wrap</strong> onto more lines instead of shrinking the font, so
      the box never overflows.</p>

      <h2>Date / time</h2>
      <Code lang="dotnet" file="DateTime.cs" code={`Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\"}");                       // current time (default)
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"date\\":\\"Signed on 10-Jun-2026\\"}");  // a fixed string
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"date\\":\\"\\"}");          // no date line`} />

      <h2>The left side</h2>
      <p>The <code>image</code> key controls what is drawn on the left of the appearance:</p>

      <Code lang="dotnet" file="LeftSide.cs" code={`Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\"}");                       // default: the ATick logo
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"image\\":\\"none\\"}");    // no logo
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"image\\":\\"cn\\"}");      // the CN as large text on the LEFT (Adobe-style)`} />

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
      <p>The mark sits centred in the appearance and tells the reader the signature&apos;s status at
      a glance:</p>

      <Code lang="dotnet" file="Mark.cs" code={`Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true}");    // the verified mark — Adobe paints it GREEN if valid+trusted, RED if invalid
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"always_check\\":true}");  // ATick's green-tick graphic as the base (Adobe still reds a bad signature)
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":false}");   // no mark — a plain signature`} />

      <ul>
        <li><strong><code>&quot;green_tick&quot;:true</code></strong> — the classic validity mark
        that Adobe Acrobat repaints <strong>green</strong> for a valid, trusted signature and
        <strong>red</strong> for a broken one.</li>
        <li><strong><code>&quot;always_check&quot;:true</code></strong> — uses ATick&apos;s own
        green-tick graphic as the base, so the tick shows in every viewer; Adobe still overlays a red
        mark if the signature is actually invalid.</li>
        <li><strong><code>&quot;green_tick&quot;:false</code></strong> — no mark; a plain signature
        appearance.</li>
      </ul>

      <h3>How Adobe shows it</h3>
      <p>When the certificate is valid and trusted, <strong>Adobe Reader / Acrobat reports
      &ldquo;Signed and all signatures are valid&rdquo;</strong> and paints the tick green — exactly
      the reassurance your readers expect.</p>

      <h3>Every state Adobe can show</h3>
      <p>ATick draws the appearance and the mark; <strong>Adobe then colours the mark based on the
      signature&apos;s validity and whether it trusts the certificate</strong>, so your reader
      instantly sees the status:</p>
      <ul>
        <li><strong>Valid &amp; trusted</strong> — signature intact <strong>and</strong> the
        certificate chains to a root Adobe trusts — <em>&ldquo;Signed and all signatures are
        valid.&rdquo;</em></li>
        <li><strong>Validity unknown</strong> — signature intact, but Adobe <strong>doesn&apos;t
        trust the certificate&apos;s root</strong> — <em>&ldquo;Validity unknown.&rdquo;</em></li>
        <li><strong>Not verified</strong> — Adobe <strong>hasn&apos;t validated</strong> the
        signature yet (no trust information) — <em>&ldquo;Signature not verified.&rdquo;</em></li>
        <li><strong>Invalid</strong> — the document was <strong>changed after signing</strong> (or
        the signature is broken) — <em>&ldquo;Signature is invalid.&rdquo;</em></li>
      </ul>
      <p>So the <strong>green</strong> tick appears only when the signature is valid <em>and</em> the
      signer&apos;s certificate chains to a root Adobe trusts (the Adobe Approved Trust List, or your
      organisation&apos;s trust). The same ATick appearance shows the question-mark or red-cross
      state automatically — you don&apos;t draw those; Adobe does.</p>

      <h3>Colouring the mark</h3>
      <p>Colour the mark with a hex string, a CSS colour name, or an <code>[r, g, b]</code> array — or
      fill it with an axial gradient:</p>

      <Code lang="dotnet" file="MarkColor.cs" code={`Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"mark_color\\":\\"#E53935\\"}");        // hex
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"mark_color\\":\\"blue\\"}");           // CSS name
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"mark_color\\":[255,140,0]}");        // RGB array
Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"mark_gradient\\":[\\"red\\",\\"orange\\",\\"yellow\\"]}");  // gradient`} />

      <p>Use <code>mark_scale</code> to resize the mark relative to the appearance box.</p>

      <h2>Fine-tuning the layout</h2>
      <p>For pixel-level control over where the mark and the text sit, use these nudge keys. They are
      all optional — the defaults already produce a balanced box.</p>

      <Code lang="dotnet" file="FineTune.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,"
  + "\\"top_reserve\\":0.32,"   // reserve the top 32% of the box for the logo / mark
  + "\\"mark_scale\\":1.1,"     // make the mark 10% larger
  + "\\"mark_dx\\":4,"          // nudge the mark 4 pt to the right
  + "\\"mark_dy\\":-2,"         // nudge the mark 2 pt down
  + "\\"text_dx\\":6,"          // nudge the signer text 6 pt to the right
  + "\\"text_top\\":0.40}");    // start the text block 40% down from the top`} />

      <table>
        <thead>
          <tr><th>Key</th><th>Effect</th></tr>
        </thead>
        <tbody>
          <tr><td><code>top_reserve</code></td><td>fraction of the box height (e.g. <code>0.32</code>) reserved at the top for the logo / mark</td></tr>
          <tr><td><code>mark_scale</code></td><td>scale factor for the mark size</td></tr>
          <tr><td><code>mark_dx</code></td><td>nudge the mark horizontally in points (positive = right)</td></tr>
          <tr><td><code>mark_dy</code></td><td>nudge the mark vertically in points (positive = up)</td></tr>
          <tr><td><code>text_dx</code></td><td>nudge the signer text horizontally in points (positive = right)</td></tr>
          <tr><td><code>text_top</code></td><td>vertical start of the text block, as a fraction of box height from the top</td></tr>
        </tbody>
      </table>

      <h2>Border styling</h2>
      <p>Turn the border on with <code>&quot;border&quot;:true</code>, then set its colour and width.
      <code>border_color</code> takes an <code>[r, g, b]</code> array and <code>border_width</code> is
      the line width in points:</p>

      <Code lang="dotnet" file="Border.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,"
  + "\\"border\\":true,"
  + "\\"border_color\\":[20,80,160],"  // RGB border colour
  + "\\"border_width\\":1.0}");        // line width in points`} />

      <h2>Distinguished name</h2>
      <Code lang="dotnet" file="Dn.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Axonate Tech\\",\\"dn\\":\\"CN=Axonate Tech, O=Personal, C=IN\\"}");`} />
      <p>The DN is shown directly under the &quot;Digitally Signed by:&quot; line.</p>

      <h2>Custom-text-only appearance</h2>
      <p>Show <strong>only</strong> your own text — no &quot;Signed by&quot;, no date, no CN
      structure. Inside <code>body</code>, <code>\n</code> starts a new line and <code>*word*</code>
      makes that run <strong>bold</strong>. Because the value lives in a JSON string in C# source,
      escape each line break as <code>\\n</code>:</p>

      <Code lang="dotnet" file="Body.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"body\\":\\"*APPROVED*\\\\nReviewed by: *Axonate Tech*\\\\nThis document is *legally binding*.\\"}");`} />

      <blockquote>In C# source <code>\\n</code> produces the two characters <code>\n</code> in the
      JSON string, which ATick reads as a line break. A literal C# newline would break the JSON.</blockquote>

      <h2>Positioning the appearance</h2>
      <p>Place the appearance with <code>page</code> + <code>rect</code>, or stamp several positions
      at once with <code>placements</code>. Coordinates are PDF points as <code>[x1, y1, x2, y2]</code>.</p>

      <Code lang="dotnet" file="Position.cs" code={`Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"page\\":1,\\"rect\\":[300,55,575,175]}");

// one stamp per entry: [page, [x1,y1,x2,y2]]
Atick.SignPfx(pdf, pfx,
    "{\\"cn\\":\\"Aniket\\",\\"green_tick\\":true,\\"placements\\":[[1,[300,55,575,175]],[2,[300,55,575,175]]]}");`} />

      <p>You can also size the box directly with <code>width</code> and <code>height</code>.</p>

      <h2>Invisible signature</h2>
      <p>A cryptographically valid signature that draws nothing on the page — pass an empty
      <code>placements</code> array:</p>

      <Code lang="dotnet" file="Invisible.cs" code={`Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"placements\\":[]}");   // empty placements`} />

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
          <tr><td><code>border_color</code></td><td>border colour as <code>[r, g, b]</code> (needs <code>border</code>)</td></tr>
          <tr><td><code>border_width</code></td><td>border line width in points, e.g. <code>1.0</code> (needs <code>border</code>)</td></tr>
          <tr><td><code>width</code>, <code>height</code></td><td>the box size</td></tr>
          <tr><td><code>mark_scale</code></td><td>scale factor for the validity mark</td></tr>
          <tr><td><code>mark_dx</code>, <code>mark_dy</code></td><td>nudge the mark in points (x right, y up)</td></tr>
          <tr><td><code>text_dx</code></td><td>nudge the signer text horizontally in points</td></tr>
          <tr><td><code>text_top</code></td><td>vertical start of the text block (fraction from top)</td></tr>
          <tr><td><code>top_reserve</code></td><td>fraction of box height reserved at the top for the logo / mark</td></tr>
        </tbody>
      </table>

      <h2>Errors</h2>
      <p>Every failure throws <code>AtickException</code>:</p>
      <Code lang="dotnet" file="Errors.cs" code={`try
{
    Atick.SignPfx(pdf, pfx, "{\\"cn\\":\\"Aniket\\",\\"image\\":\\"missing.png\\"}");
}
catch (AtickException e)
{
    Console.WriteLine("signing failed: " + e.Message);
}`} />

      <p><a href="/docs/dotnet/certification/">Next page →</a></p>
    </DocsShell>
  );
}
