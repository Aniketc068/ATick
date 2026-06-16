import { DocsShell } from "@/components/docs-shell";
import { Code } from "@/components/code";

export default function Page() {
  return (
    <DocsShell lang="java" section="">
      <h1>ATick for Java</h1>
      <p>Standalone PDF digital-signature library for the JVM — PAdES &amp; CMS signing with a PFX/PEM
      file, deferred eSign/HSM/token signing, RFC-3161 timestamps, long-term validation and a
      green-tick appearance Adobe shows as valid. Pure Java, one Maven dependency.</p>
      <blockquote>Maven: <code>io.github.aniketc068:atick:1.0.6</code></blockquote>
      <h2>Sign in one call</h2>
      <Code lang="java" file="Sign.java" code={`import io.github.aniketc068.atick.Atick;

byte[] signed = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket Chaturvedi\\","
  + "\\"reason\\":\\"Approved\\",\\"page\\":1,\\"rect\\":[300,55,575,175],"
  + "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");`} />
      <p><a href="/docs/java/quickstart/">Quickstart →</a></p>
    </DocsShell>
  );
}
