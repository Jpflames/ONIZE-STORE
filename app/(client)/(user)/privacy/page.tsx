import Container from "@/components/Container";
import type { Metadata } from "next";
import {
  Database,
  BarChart2,
  Share2,
  Lock,
  Cookie,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ONIZE",
  description: "Understand how ONIZE collects, uses, and protects your data.",
};

const sections = [
  {
    icon: Database,
    number: "01",
    title: "Information We Collect",
    body: "We collect information you voluntarily provide — such as your name, email, shipping address, and payment details — when you register, place an order, or contact us. We also automatically collect device and usage data (IP address, browser type, pages visited) to improve our services.",
  },
  {
    icon: BarChart2,
    number: "02",
    title: "How We Use Your Information",
    body: "We use your data to process orders, personalise your experience, send transactional emails and relevant promotions (with your consent), detect fraud, and comply with legal obligations. We never sell your data to third parties for their own marketing purposes.",
  },
  {
    icon: Share2,
    number: "03",
    title: "Information Sharing",
    body: "We may share your data with trusted service providers (payment processors, delivery partners, analytics tools) strictly to operate our platform. All third parties are contractually obligated to protect your data and use it only as instructed by us.",
  },
  {
    icon: Lock,
    number: "04",
    title: "Data Security",
    body: "We implement industry-standard security measures including TLS encryption, access controls, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure — if you suspect a breach, contact us immediately.",
  },
  {
    icon: Cookie,
    number: "05",
    title: "Cookies & Tracking",
    body: "We use essential cookies to operate the site, performance cookies to understand usage patterns, and optional marketing cookies to deliver relevant ads. You can manage your cookie preferences at any time through your browser settings or our cookie banner.",
  },
  {
    icon: UserCheck,
    number: "06",
    title: "Your Rights",
    body: "You have the right to access, correct, download, or delete your personal data at any time. You can also withdraw consent for marketing communications or request data portability. To exercise any of these rights, contact our Privacy Officer at privacy@onize.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <Container className="py-16 md:py-20 relative">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Your privacy matters to us. This policy explains exactly what data
              we collect, why we collect it, and how it&apos;s protected. Last
              updated:{" "}
              <span className="font-semibold text-foreground">
                February 2025
              </span>
              .
            </p>
          </Container>
        </div>
      </section>

      {/* Sections */}
      <Container className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="group bg-card border border-border rounded-2xl p-7 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-0.5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Section {s.number}
                    </p>
                    <h2 className="text-lg font-bold mb-2">{s.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground text-center">
          Have a privacy concern?{" "}
          <Link
            href="/contact"
            className="text-primary font-semibold hover:underline"
          >
            Contact our Privacy Officer
          </Link>{" "}
          and we&apos;ll respond within 48 hours.
        </div>
      </Container>
    </div>
  );
}
