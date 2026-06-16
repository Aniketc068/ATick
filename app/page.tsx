import { PixelHero } from "@/components/ui/pixel-perfect-hero";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { LanguageShowcase, type LangItem } from "@/components/language-showcase";
import { highlight } from "@/lib/highlight";
import { KeyRound, ShieldCheck, Globe, Paintbrush, Lock, Rocket } from "lucide-react";

const LANGS = [
  { id: "python", name: "Python", reg: "PyPI", file: "sign.py", install: "pip install atick",
    code: `import atick

signed = atick.sign_pfx(
    open("doc.pdf", "rb").read(),
    pfx=open("my.pfx", "rb").read(), password="••••",
    style=atick.Style(cn="Aniket Chaturvedi", reason="Approved"),
    placements=[(1, (300, 55, 575, 175))],
    pades=True, timestamp=True, ltv=True,   # PAdES-B-LT
)
open("signed.pdf", "wb").write(signed)` },
  { id: "java", name: "Java", reg: "Maven Central", file: "Sign.java", install: "io.github.aniketc068:atick:1.0.6",
    code: `import io.github.aniketc068.atick.Atick;

byte[] signed = Atick.signPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket Chaturvedi\\","
  + "\\"reason\\":\\"Approved\\",\\"page\\":1,\\"rect\\":[300,55,575,175],"
  + "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");` },
  { id: "dotnet", name: ".NET", reg: "NuGet", file: "Sign.cs", install: "dotnet add package ATick",
    code: `using Aniketc068.ATick;

byte[] signed = Atick.SignPfx(pdf, pfx,
    "{\\"password\\":\\"••••\\",\\"cn\\":\\"Aniket Chaturvedi\\"," +
    "\\"reason\\":\\"Approved\\",\\"page\\":1,\\"rect\\":[300,55,575,175]," +
    "\\"pades\\":true,\\"timestamp\\":true,\\"ltv\\":true}");` },
  { id: "node", name: "Node.js", reg: "npm", file: "sign.js", install: "npm install atick",
    code: `const atick = require("atick");

const signed = atick.signPfx(pdf, pfx, JSON.stringify({
  password: "••••", cn: "Aniket Chaturvedi", reason: "Approved",
  page: 1, rect: [300, 55, 575, 175],
  pades: true, timestamp: true, ltv: true,   // PAdES-B-LT
}));` },
  { id: "php", name: "PHP", reg: "Packagist", file: "sign.php", install: "composer require aniketc068/atick",
    code: `use Aniketc068\\ATick\\Atick;

$signed = Atick::signPfx($pdf, $pfx, [
    'password' => '••••', 'cn' => 'Aniket Chaturvedi',
    'reason' => 'Approved', 'page' => 1, 'rect' => [300, 55, 575, 175],
    'pades' => true, 'timestamp' => true, 'ltv' => true,
]);` },
];

const features = [
  { t: "Sign anywhere", d: "PFX/P12 or PEM files, USB tokens & HSMs (PKCS#11), the Windows store and Indian eSign — one API.", Icon: KeyRound },
  { t: "Full PAdES", d: "B-B, B-T, B-LT and B-LTA with RFC-3161 timestamps and long-term validation — recognised by Adobe.", Icon: ShieldCheck },
  { t: "Deferred / eSign", d: "Two-step prepare → external CMS → embed for remote keys, HSMs and CCA eSign ESPs.", Icon: Globe },
  { t: "Rich appearance", d: "Logo or CN, the validity mark, distinguished name, custom text and invisible signatures.", Icon: Paintbrush },
  { t: "Certify & lock", d: "Certification (DocMDP), field-locking, pre-sign CRL/OCSP checks, encryption and metadata.", Icon: Lock },
  { t: "Built for scale", d: "A revocation cache makes batch signing several times faster; every failure is a clean exception.", Icon: Rocket },
];

const marks = [
  { img: "signature_appearance.png", t: "Valid & trusted", d: "green tick", c: "text-brand" },
  { img: "sig_unknown.png", t: "Validity unknown", d: "yellow “?”", c: "text-yellow-400/90" },
  { img: "sig_notverified.png", t: "Not verified", d: "“?” unvalidated", c: "text-muted-foreground" },
  { img: "sig_invalid.png", t: "Invalid", d: "red cross", c: "text-red-400/90" },
];

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{sub}</p>
    </div>
  );
}

export default async function Home() {
  const langs: LangItem[] = await Promise.all(
    LANGS.map(async (l) => ({
      id: l.id, name: l.name, reg: l.reg, file: l.file, install: l.install,
      codeHtml: await highlight(l.code, l.id),
    }))
  );

  return (
    <>
      <SiteNav />

      <PixelHero
        word1="Verified"
        word2="signatures."
        description="The standalone PDF digital-signature library — PAdES & CMS signing, RFC-3161 timestamps, long-term validation and a green-tick appearance Adobe shows as valid. One engine, five languages."
        primaryCta="Read the docs"
        primaryCtaMobile="Docs"
        primaryHref="/docs/python/"
        secondaryCta="View on GitHub"
        secondaryCtaMobile="GitHub"
        githubUrl="https://github.com/Aniketc068"
        trustLabel="Available in five languages"
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] grid-bg [mask-image:radial-gradient(50rem_28rem_at_50%_0%,#000,transparent)]" />

        <section id="languages" className="container-x relative scroll-mt-24 py-24">
          <SectionHead eyebrow="One API, five ecosystems" title="Native to your stack" sub="The same engine, the same calls — one package wherever you build. Pick a language:" />
          <div className="mt-12"><LanguageShowcase langs={langs} /></div>
        </section>

        <section className="container-x relative py-10">
          <div className="mx-auto max-w-3xl glass p-2">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">Adobe Acrobat — Signature panel</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/valid_signature_adobe.png" alt="Adobe — signed and all signatures are valid, with the ATick green tick" className="w-full rounded-xl border border-white/[0.06]" />
          </div>
        </section>

        <section id="features" className="container-x relative scroll-mt-24 py-24">
          <SectionHead eyebrow="Everything, built in" title="Everything you need to sign PDFs" sub="From a one-line signature to certified, long-term-valid, multi-signatory documents." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ t, d, Icon }) => (
              <div key={t} className="group bg-background/80 p-7 transition-colors hover:bg-white/[0.02]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-foreground transition-colors group-hover:bg-white/[0.08]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-x relative py-10">
          <div className="glass p-8 sm:p-14">
            <SectionHead eyebrow="Trust, visualised" title="The mark Adobe colours for you" sub="ATick draws one verified-signature appearance — Adobe paints it by the signature’s real status." />
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
              {marks.map((m) => (
                <figure key={m.t} className="text-center">
                  <div className="glass-soft p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/brand/${m.img}`} alt={m.t} className="mx-auto w-full rounded-lg" />
                  </div>
                  <figcaption className="mt-3 text-sm font-medium">{m.t}<br /><span className={`text-xs ${m.c}`}>{m.d}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x relative py-24">
          <div className="relative overflow-hidden glass p-12 text-center sm:p-20">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ship valid PDF signatures today</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Install in your language, sign your first document in under a minute. Free under AGPL-3.0.</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href="/docs/python/" className="btn-white h-11">Read the docs →</a>
                <a href="https://github.com/Aniketc068" target="_blank" rel="noopener noreferrer" className="btn-glass h-11">Star on GitHub</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
