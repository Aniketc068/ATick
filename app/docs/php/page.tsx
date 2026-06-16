import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="php" section="">
      <h1>ATick for PHP</h1>
      <p>Standalone PDF digital-signature library for PHP — PAdES &amp; CMS signing with a PFX/PEM
      file, deferred eSign/HSM/token signing, RFC-3161 timestamps, long-term validation and a
      green-tick appearance Adobe shows as valid. Engine bundled via PHP FFI, cross-platform.</p>
      <blockquote>Install: <code>composer require aniketc068/atick</code> · PHP 7.4+ with FFI enabled.</blockquote>
      <h2>Sign in one call</h2>
      <Code lang="php" file="sign.php" code={`use Aniketc068\\ATick\\Atick;

$signed = Atick::signPfx($pdf, $pfx, [
    'password' => '••••', 'cn' => 'Aniket Chaturvedi',
    'reason' => 'Approved', 'page' => 1, 'rect' => [300, 55, 575, 175],
    'pades' => true, 'timestamp' => true, 'ltv' => true,
]);`} />
      <p><a href="/docs/php/quickstart/">Quickstart →</a></p>
    </DocsShell>
  );
}
