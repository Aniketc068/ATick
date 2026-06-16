import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Quick start · Python', description: 'Sign your first PDF with ATick for Python in a few lines — PAdES signature, timestamp and an Adobe-valid green-tick appearance.', alternates: { canonical: '/docs/python/quickstart/' } };

export default function Page() {
  return (
    <DocsShell lang="python" section="quickstart">
      <h1>Quick start</h1>

      <h2>Sign a PDF with a <code>.pfx</code></h2>
      <Code lang="python" file="quickstart.py" code={`import atick

pdf = open("document.pdf", "rb").read()
pfx = open("my_certificate.pfx", "rb").read()

signed = atick.sign_pfx(
    pdf, pfx=pfx, password="••••",
    style=atick.Style(cn="Aniket Chaturvedi", org="Acme Corp", reason="Approved"),
    placements=[(1, (300, 55, 575, 175))],   # page 1, rectangle (x1, y1, x2, y2)
)
open("signed.pdf", "wb").write(signed)`} />

      <p><code>placements</code> is a list of <code>(page_number, (x1, y1, x2, y2))</code> — the
      signature appearance is drawn in each rectangle. Page numbers start at 1; coordinates are PDF
      points from the bottom-left.</p>

      <h2>Add a timestamp and long-term validation (PAdES-B-LT)</h2>
      <Code lang="python" file="quickstart_blt.py" code={`signed = atick.sign_pfx(
    pdf, pfx=pfx, password="••••",
    style=atick.Style(cn="Aniket Chaturvedi", reason="Approved"),
    placements=[(1, (300, 55, 575, 175))],
    pades=True, timestamp=True, ltv=True,
)`} />

      <p>See <a href="/docs/python/pades/">PAdES levels</a> for B-B / B-T / B-LT / B-LTA.</p>

      <h2>The same from the command line</h2>
      <Code lang="bash" file="quickstart.sh" code={`atick sign document.pdf signed.pdf --pfx my_certificate.pfx --password ••• \\
      --cn "Aniket Chaturvedi" --reason Approved --timestamp --ltv \\
      --page 1 --rect 300,55,575,175`} />

      <h2>Error handling</h2>
      <p>Every failure — wrong password, malformed PDF, unreachable timestamp authority — is a
      Python <code>atick.AtickError</code>:</p>
      <Code lang="python" file="errors.py" code={`try:
    signed = atick.sign_pfx(pdf, pfx=pfx, password="wrong", style=style, placements=placements)
except atick.AtickError as e:
    print("signing failed:", e)`} />

      <p><a href="/docs/python/install/">Next page →</a></p>
    </DocsShell>
  );
}
