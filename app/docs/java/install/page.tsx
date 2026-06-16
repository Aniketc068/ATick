import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";
import type { Metadata } from "next";
export const metadata: Metadata = { title: 'Installation · Java', description: 'Install ATick for Java — supported platforms, package manager and requirements.', alternates: { canonical: '/docs/java/install/' } };

export default function Page() {
  return (
    <DocsShell lang="java" section="install">
      <h1>Installation</h1>
      <p>ATick for Java is one Maven dependency. It is a pure-Java, self-contained library — there is
      no build step, toolchain, or extra setup on your side. Add the dependency and start signing.</p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Java 8 or newer</strong> (runs on 8, 11, 17, 21, …).</li>
        <li>A 32-bit <strong>or</strong> 64-bit JVM — both are supported.</li>
      </ul>

      <h2>Maven</h2>
      <Code lang="java" file="pom.xml" code={`<dependency>
  <groupId>io.github.aniketc068</groupId>
  <artifactId>atick</artifactId>
  <version>1.0.6</version>
</dependency>`} />

      <h2>Gradle</h2>
      <Code lang="java" file="build.gradle" code={`implementation 'io.github.aniketc068:atick:1.0.6'`} />
      <Code lang="java" file="build.gradle.kts" code={`// Kotlin DSL
implementation("io.github.aniketc068:atick:1.0.6")`} />

      <h2>One artifact, every platform</h2>
      <p>The same dependency works everywhere the JVM runs — Windows (64/32-bit), Linux and macOS —
      with nothing extra to install.</p>
      <table>
        <thead>
          <tr><th>Platform</th><th>Supported</th></tr>
        </thead>
        <tbody>
          <tr><td>Windows 64-bit</td><td>yes</td></tr>
          <tr><td>Windows 32-bit</td><td>yes</td></tr>
          <tr><td>Linux x86-64</td><td>yes</td></tr>
          <tr><td>Linux ARM64</td><td>yes</td></tr>
          <tr><td>macOS Intel</td><td>yes</td></tr>
          <tr><td>macOS Apple Silicon</td><td>yes</td></tr>
        </tbody>
      </table>

      <h2>Verify the install</h2>
      <Code lang="java" file="Verify.java" code={`import io.github.aniketc068.atick.Atick;

System.out.println(Atick.version());   // prints the library version, e.g. 1.0.6`} />

      <p><a href="/docs/java/signing/">Next page →</a></p>
    </DocsShell>
  );
}
