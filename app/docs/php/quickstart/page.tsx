import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Quickstart · PHP', description: 'Sign your first PDF with ATick for PHP in a few lines — PAdES signature, timestamp and an Adobe-valid green-tick appearance.', alternates: { canonical: '/docs/php/quickstart/' } };

export default function Page() {
  return (
    <DocsShell lang="php" section="quickstart">
      <h1>Quickstart</h1>
      <p>Sign a PDF with a <code>.pfx</code> (or <code>.p12</code> / <code>.pem</code>) and a visible green-tick appearance.</p>
      <Code lang="php" file="sign.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;

$pdf = file_get_contents("doc.pdf");
$pfx = file_get_contents("my.pfx");

$signed = Atick::signPfx($pdf, $pfx, [
    "password" => "••••", "cn" => "Axonate Tech", "reason" => "Approved",
    "green_tick" => true, "page" => 1, "rect" => [300, 55, 575, 175],
    "pades" => true, "timestamp" => true, "ltv" => true,   // PAdES-B-LT
]);

file_put_contents("signed.pdf", $signed);`} />
      <p>Open <code>signed.pdf</code> in Adobe Reader — for a trusted certificate it shows a valid green tick and
      <strong> &ldquo;Signed and all signatures are valid.&rdquo;</strong></p>

      <h2>Options as a JSON string</h2>
      <p><code>$options</code> is a PHP associative array (preferred), but a JSON string works too:</p>
      <Code lang="php" file="sign.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;

$signed = Atick::signPfx(file_get_contents("doc.pdf"), file_get_contents("my.pfx"),
    json_encode(["password" => "••••", "cn" => "Axonate Tech", "pades" => true, "page" => 1, "rect" => [300, 55, 575, 175]]));
file_put_contents("signed.pdf", $signed);`} />

      <h2>A minimal, invisible signature</h2>
      <Code lang="php" file="sign.php" code={`$signed = Atick::signPfx($pdf, $pfx, ["password" => "••••", "placements" => [], "pades" => true]);`} />

      <h2>Catching errors</h2>
      <Code lang="php" file="sign.php" code={`use Aniketc068\\ATick\\AtickException;

try {
    Atick::signPfx($pdf, $pfx, ["password" => "wrong"]);
} catch (AtickException $e) {
    fwrite(STDERR, "signing failed: " . $e->getMessage() . "\\n");
}`} />

      <p>Next: see Signing for all the options, or the API reference.</p>
      <p><a href="/docs/php/install/">Next page →</a></p>
    </DocsShell>
  );
}
