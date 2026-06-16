import type { Metadata } from "next";
import { ShieldCheck, Lock, Globe, Target, Eye, Sparkles, BadgeCheck, Mail, ExternalLink } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const COMPANY_URL = "https://axonatetech.com/";
const EMAIL = "info@axonatetech.com";

export const metadata: Metadata = {
  title: "About Axonate Tech",
  description:
    "ATick is a product by Axonate Tech — an ISO 27001 (ISMS) and ISO 9001 certified provider of enterprise data annotation, AI training data and BPO services, trusted across 25+ countries with a 99.5% accuracy rate.",
  alternates: { canonical: "/about/" },
};

const stats = [
  ["10M+", "Data points annotated"],
  ["99.5%", "Accuracy rate"],
  ["250+", "AI projects delivered"],
  ["200+", "Languages supported"],
  ["25+", "Countries served"],
  ["24/7", "Expert support"],
];

const mvv = [
  { icon: Target, title: "Mission", body: "To democratise access to high-quality training data and enable organisations of all sizes to build robust AI and ML models through innovative, scalable, cost-effective data solutions." },
  { icon: Eye, title: "Vision", body: "To be the most trusted global partner for AI-ready data solutions, driving technological advancement across industries while maintaining the highest standards of quality, security and ethics." },
  { icon: Sparkles, title: "Values", body: "Excellence in delivery, integrity in operations, innovation in approach, collaboration with partners, and an unwavering commitment to data security and privacy." },
];

const certs = [
  { icon: ShieldCheck, title: "ISO 9001", body: "Quality management systems — consistent processes and continual improvement on every project." },
  { icon: Lock, title: "SOC 2 Type II", body: "Audited security, availability and confidentiality controls for sensitive client data." },
  { icon: BadgeCheck, title: "GDPR · HIPAA · PCI DSS", body: "Compliance with global data-protection and privacy regulations across regulated industries." },
];

const presence = {
  centres: [
    "Bangalore — Technology & Innovation Hub",
    "Hyderabad — Data Operations Centre",
    "Pune — Quality Assurance Excellence Centre",
    "Mumbai — Enterprise Solutions Delivery",
  ],
  regions: [
    "North America — USA, Canada",
    "Europe — UK, Germany, France, Netherlands",
    "Asia-Pacific — Singapore, Australia, Japan",
    "Middle East — UAE, Saudi Arabia",
  ],
};

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="container-x min-h-dvh pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <p className="eyebrow">About</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A product by <span className="text-brand">Axonate Tech</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            Axonate Tech is a leading provider of enterprise-grade data annotation, AI training data
            and business-process outsourcing services. We combine cutting-edge technology with human
            expertise to deliver high-quality data solutions that power machine-learning and AI
            applications across industries worldwide.
          </p>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            With 500+ successfully delivered projects, 1000+ skilled professionals and a proven 99.5%
            accuracy rate, we serve clients across 25+ countries with ISO-certified quality standards
            and robust security protocols. <strong className="text-foreground">ATick</strong> — this
            standalone PDF digital-signature library — is one of our products.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer"
               className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
              Visit axonatetech.com <ExternalLink className="h-4 w-4" />
            </a>
            <a href={`mailto:${EMAIL}`}
               className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-semibold text-foreground transition-colors hover:border-white/25">
              <Mail className="h-4 w-4 text-primary" /> {EMAIL}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3">
            {stats.map(([n, l]) => (
              <div key={l} className="bg-[hsl(240_6%_5%)] p-6">
                <div className="text-3xl font-bold tracking-tight">{n}</div>
                <div className="mt-1 text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>

          {/* ISO 27001 — featured */}
          <h2 className="mt-16 text-2xl font-bold tracking-tight">Certified information security</h2>
          <div className="glass mt-6 flex flex-col items-center gap-7 p-7 sm:flex-row sm:items-start">
            <img src="/brand/iso-27001.png" alt="ISO/IEC 27001 certified — Information Security Management System"
                 width={140} height={140} className="h-32 w-32 shrink-0 rounded-xl bg-white p-2" />
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold">ISO/IEC 27001 — Information Security Management</h3>
              </div>
              <p className="mt-3 text-muted-foreground">
                A certified Information Security Management System (ISMS) ensuring systematic
                protection of sensitive data through formal risk assessment, layered security
                controls and continuous monitoring. Your data is handled under internationally
                recognised security standards at every stage of the pipeline.
              </p>
            </div>
          </div>

          {/* Other certifications */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {certs.map((c) => (
              <div key={c.title} className="glass-soft p-5">
                <c.icon className="h-5 w-5 text-brand" />
                <h3 className="mt-2 font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Mission / Vision / Values */}
          <h2 className="mt-16 text-2xl font-bold tracking-tight">Our foundation</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {mvv.map((m) => (
              <div key={m.title} className="glass p-6">
                <m.icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
              </div>
            ))}
          </div>

          {/* Global presence */}
          <h2 className="mt-16 text-2xl font-bold tracking-tight">Our global presence</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Headquartered in India with strategic operations across multiple cities, Axonate Tech
            serves clients across North America, Europe, Asia-Pacific and the Middle East — combining
            distributed delivery with local expertise for globally consistent quality.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="glass-soft p-6">
              <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-brand" /><h3 className="font-semibold">Delivery centres</h3></div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {presence.centres.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <div className="glass-soft p-6">
              <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-brand" /><h3 className="font-semibold">Client regions</h3></div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {presence.regions.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="glass mt-14 flex flex-col items-start gap-3 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to partner with us?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Talk to our team about your AI &amp; data initiatives.</p>
            </div>
            <a href={`mailto:${EMAIL}`}
               className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
              <Mail className="h-4 w-4" /> {EMAIL}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
