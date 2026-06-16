import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="php" section="install">
      <h1>Installation</h1>
      <p>ATick for PHP is one Composer package with the matching engine bundled inside — no compiler, no
      build step, no other PHP dependency.</p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>PHP 7.4 or newer</strong> (through the latest 8.x), with the <strong>FFI extension</strong> enabled.</li>
        <li>On the CLI the FFI extension is usually available out of the box. On a web SAPI (PHP-FPM / Apache)
        enable it in <code>php.ini</code>:</li>
      </ul>
      <Code lang="php" file="php.ini" code={`extension=ffi
ffi.enable=1        ; or: ffi.enable=preload`} />
      <ul>
        <li>Any supported OS/arch — Windows 7+ (x64/x86/ARM64), Linux (x64/ARM64/ARM, every glibc distro), macOS (Intel/Apple Silicon).</li>
      </ul>

      <h2>Install</h2>
      <Code lang="php" file="terminal" code={`composer require aniketc068/atick`} />

      <h2>Verify</h2>
      <Code lang="php" file="verify.php" code={`<?php
require 'vendor/autoload.php';

use Aniketc068\\ATick\\Atick;

echo Atick::version(), "\\n";   // e.g. 1.0.6`} />

      <h2>How the bundled engine is loaded</h2>
      <p>The package ships the matching ATick engine for each platform inside the package. At
      <code> require &apos;vendor/autoload.php&apos;</code> the right one for your OS and architecture is loaded automatically
      through <strong>PHP FFI</strong> — there is no compilation on install.</p>
      <table>
        <thead>
          <tr><th>Platform</th><th>Target</th></tr>
        </thead>
        <tbody>
          <tr><td><code>windows-x86_64</code> / <code>windows-i686</code></td><td>Windows 7 → 11 (64/32-bit)</td></tr>
          <tr><td><code>windows-aarch64</code></td><td>Windows on ARM64</td></tr>
          <tr><td><code>linux-x86_64</code> / <code>linux-aarch64</code> / <code>linux-arm</code> / <code>linux-i686</code></td><td>Linux x64 / ARM64 / ARM / 32-bit (glibc 2.17+, every distro)</td></tr>
          <tr><td><code>darwin-x86_64</code> / <code>darwin-aarch64</code></td><td>macOS Intel / Apple Silicon</td></tr>
        </tbody>
      </table>
      <p>PHP supported: <strong>7.4 → latest 8.x</strong>.</p>

      <h2>Other languages</h2>
      <p>ATick is the same engine across runtimes. The same code translates directly:</p>
      <ul>
        <li>Python — <code>pip install atick</code></li>
        <li>Java — <code>io.github.aniketc068:atick</code></li>
        <li>.NET — <code>dotnet add package ATick</code></li>
        <li>Node.js — <code>npm install atick</code></li>
      </ul>

      <p><a href="/docs/php/signing/">Next page →</a></p>
    </DocsShell>
  );
}
