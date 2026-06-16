import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Installation · .NET', description: 'Install ATick for .NET — supported platforms, package manager and requirements.', alternates: { canonical: '/docs/dotnet/install/' } };

export default function Page() {
  return (
    <DocsShell lang="dotnet" section="install">
      <h1>Installation</h1>
      <p>ATick for .NET is one self-contained NuGet package. Everything needed for your OS and
      architecture ships inside it and is loaded automatically — there is no compiler or build step
      on your side.</p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Any .NET</strong> — .NET Framework 2.0 / 3.5 / 4.x (Windows 7 era), .NET
        Standard 2.0, or modern .NET 5/6/7/8 and up. The package multi-targets them all.</li>
        <li>Any supported OS/arch — Windows 7+ (x86/x64/ARM64), Linux (x64/ARM64/ARM), macOS
        (Intel/Apple Silicon).</li>
      </ul>

      <h2>Install</h2>
      <Code lang="bash" file="terminal" code={`dotnet add package ATick`} />

      <p><code>.csproj</code>:</p>
      <Code lang="xml" file="MyApp.csproj" code={`<PackageReference Include="ATick" Version="1.0.6" />`} />

      <p>Package Manager Console:</p>
      <Code lang="powershell" file="PMC" code={`Install-Package ATick`} />

      <h2>One package, every platform</h2>
      <p>The package targets every supported platform and .NET selects the right one at runtime, so
      the same dependency works everywhere.</p>
      <table>
        <thead>
          <tr><th>RID</th><th>Supported</th></tr>
        </thead>
        <tbody>
          <tr><td><code>win-x64</code> / <code>win-x86</code></td><td>Windows 7 → 11, 64 / 32-bit (Windows-7-compatible)</td></tr>
          <tr><td><code>win-arm64</code></td><td>Windows on ARM64</td></tr>
          <tr><td><code>linux-x64</code></td><td>Linux x64</td></tr>
          <tr><td><code>linux-arm64</code> / <code>linux-arm</code></td><td>Linux ARM64 / ARM</td></tr>
          <tr><td><code>osx-x64</code> / <code>osx-arm64</code></td><td>macOS Intel / Apple Silicon</td></tr>
        </tbody>
      </table>

      <h2>Verify the install</h2>
      <Code lang="dotnet" file="Verify.cs" code={`using Aniketc068.ATick;

Console.WriteLine(Atick.Version());   // prints the version, e.g. 1.0.6`} />

      <p><a href="/docs/dotnet/signing/">Next page →</a></p>
    </DocsShell>
  );
}
