import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="python" section="appearance">
      <h1>Appearance</h1>

      <p>The signature appearance is described by <code>atick.Style(...)</code>. By default it shows
      the ATick logo on the left, the signer details on the right, and the validity mark.</p>

      <Code lang="python" file="style.py" code={`atick.Style(
    cn="Aniket Chaturvedi",          # common name (shown bold after "Digitally Signed by:")
    org="Acme Corp",                  # organisation line
    reason="Approved",                # "Reason: ..."
    location="New Delhi",             # "Location: ..."
    date=None,                        # None = current time; "" = no date line; or your own string
    date_format="%d-%b-%Y %I:%M %p",  # strftime pattern for the auto date - any world format
)`} />

      <h2>Date / time format</h2>
      <Code lang="python" file="date_format.py" code={`atick.Style(date_format="%Y-%m-%d %H:%M:%S")   # 2026-06-10 15:54:21  (ISO-ish)
atick.Style(date_format="%d/%m/%Y %H:%M")      # 10/06/2026 15:54     (DD/MM/YYYY)
atick.Style(date_format="%m/%d/%Y %I:%M %p")   # 06/10/2026 03:54 PM  (US)
atick.Style(date_format="%A, %d %B %Y")        # Wednesday, 10 June 2026
atick.Style(date="Signed on 10-Jun-2026")      # a fixed string you provide
atick.Style(date="")                            # no date line`} />

      <p>Long names <strong>wrap</strong> onto more lines instead of shrinking the font, so the box
      never overflows.</p>

      <h2>The left side</h2>
      <Code lang="python" file="left_side.py" code={`atick.Style(cn="...")                   # default: the ATick logo
atick.Style(cn="...", image="logo.png") # your own logo (path or bytes; transparency preserved)
atick.Style(cn="...", image=False)      # no logo
atick.Style(cn="...", image="cn")       # the CN as large text on the LEFT (Adobe-style)`} />

      <h2>The validity mark — ATick&apos;s signature look</h2>
      <p>The mark sits centred in the appearance and tells the reader the signature&apos;s status at
      a glance:</p>
      <Code lang="python" file="validity_mark.py" code={`atick.Style(cn="...", green_tick=True)    # the "?" mark - Adobe paints it GREEN if valid+trusted, RED if invalid
atick.Style(cn="...", always_check=True)  # ATick's green-tick graphic as the base (Adobe still reds a bad signature)
atick.Style(cn="...", green_tick=False)   # no mark - a plain signature`} />

      <ul>
        <li><strong><code>green_tick=True</code></strong> — the classic validity mark: a
        <code>?</code> that Adobe Acrobat repaints <strong>green</strong> for a valid, trusted
        signature and <strong>red</strong> for a broken one.</li>
        <li><strong><code>always_check=True</code></strong> — embeds ATick&apos;s own green-tick
        graphic as the base, so the tick shows in every viewer; Adobe still overlays a red mark if
        the signature is actually invalid.</li>
      </ul>

      <h2>How Adobe shows it</h2>
      <p>ATick draws the appearance and the mark; <strong>Adobe then colours the mark based on the
      signature&apos;s validity and whether it trusts the certificate</strong>, so your reader
      instantly sees the status:</p>
      <ul>
        <li><strong>Valid &amp; trusted</strong> — signature intact <strong>and</strong> the
        certificate chains to a root Adobe trusts — “Signed and all signatures are valid.”</li>
        <li><strong>Validity unknown</strong> — signature intact, but Adobe <strong>doesn&apos;t
        trust the certificate&apos;s root</strong> — “Validity unknown.”</li>
        <li><strong>Not verified</strong> — Adobe <strong>hasn&apos;t validated</strong> the
        signature yet (no trust information) — “Signature not verified.”</li>
        <li><strong>Invalid</strong> — the document was <strong>changed after signing</strong> (or
        the signature is broken) — “Signature is invalid.”</li>
      </ul>
      <p>So the <strong>green</strong> tick appears only when the signature is valid <em>and</em> the
      signer&apos;s certificate chains to a root Adobe trusts (the Adobe Approved Trust List, or your
      organisation&apos;s trust). The same ATick appearance shows the question-mark or red-cross
      state automatically — you don&apos;t draw those; Adobe does.</p>

      <p>Colour the mark with any Python colour, or a gradient:</p>
      <Code lang="python" file="mark_color.py" code={`atick.Style(cn="...", mark_color="#E53935")            # hex
atick.Style(cn="...", mark_color="blue")               # CSS name
atick.Style(cn="...", mark_color=(255, 140, 0))        # RGB 0-255 (or 0-1 floats)
atick.Style(cn="...", mark_gradient=["red", "orange", "yellow"])   # axial gradient`} />

      <h2>Distinguished name</h2>
      <Code lang="python" file="dn.py" code={`atick.Style(cn="Aniket Chaturvedi", dn="CN=Aniket Chaturvedi, O=Personal, C=IN")`} />
      <p>The DN is shown directly under the “Digitally Signed by:” line.</p>

      <h2>Custom-text-only appearance</h2>
      <p>Show <strong>only</strong> your own text — no “Signed by”, no date, no CN structure.
      <code>\\n</code> starts a new line; <code>*word*</code> makes that run <strong>bold</strong>.</p>
      <Code lang="python" file="custom_body.py" code={`atick.Style(body="*APPROVED*\\nReviewed by: *Aniket Chaturvedi*\\nThis document is *legally binding*.")`} />

      <h2>Invisible signature</h2>
      <p>A cryptographically valid signature that draws nothing on the page:</p>
      <Code lang="python" file="invisible.py" code={`atick.sign_pfx(pdf, pfx=pfx, password=pw, style=atick.Style(cn="..."), placements=[])   # empty placements`} />

      <h2>Other Style options</h2>
      <p><code>font_size</code>, <code>text_dx</code>, <code>text_top</code>, <code>text_color</code>,
      <code>bg_color</code>, <code>border</code>, <code>border_color</code>, <code>border_width</code>,
      <code>mark_scale</code>, <code>mark_dx</code>, <code>mark_dy</code>, <code>width</code>,
      <code>height</code>, <code>heading</code>, <code>ou</code>, <code>text</code>.</p>

      <p><a href="/docs/python/certification/">Next page →</a></p>
    </DocsShell>
  );
}
