import Container from "@/components/Container";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Zap,
  Users,
  HeartHandshake,
  PackageCheck,
  Globe,
} from "lucide-react";
import AboutStats, { AboutHeroStats } from "@/components/new/AboutStats";

export const metadata: Metadata = {
  title: "About Us | ONIZE",
  description:
    "Learn about ONIZE — our story, mission, values, and the team behind the premium shopping experience.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    desc: "Every product in our catalog is carefully vetted to meet the highest standards of performance and durability.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "From browsing to delivery, we're obsessed with speed. Orders are processed and dispatched within 24 hours.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    desc: "We genuinely care about your experience. Our support team is always here to make things right.",
  },
  {
    icon: PackageCheck,
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprises. What you see is what you pay — fair, honest, always.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Built around real feedback from real customers. Every feature we ship comes from listening to you.",
  },
  {
    icon: Globe,
    title: "Worldwide Reach",
    desc: "Serving customers in 50+ countries with localized experiences and global-standard logistics.",
  },
];

const stats = [
  { label: "Happy Customers", value: "120K+" },
  { label: "Products Listed", value: "8,000+" },
  { label: "Countries Served", value: "50+" },
  { label: "Years of Trust", value: "5+" },
];

const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Container className="py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Built for people who{" "}
              <span className="text-primary">love great products.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              ONIZE started with a simple belief — shopping for quality tech
              shouldn&apos;t be complicated, overpriced, or frustrating. Since
              2020, we&apos;ve been on a mission to make premium products
              accessible to everyone, delivered with the care and speed you
              deserve.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-background">
        <Container className="py-12">
          <AboutHeroStats />
        </Container>
      </section>

      {/* Mission */}
      <section className="border-b border-border bg-card">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5">
                Connecting people with the tech they love.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We exist to close the gap between great products and the people
                who need them. Our platform curates only the best — rigorously
                tested, fairly priced, and rapidly delivered — because we
                believe everyone deserves access to tools that make life better.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We&apos;re not just a marketplace. We&apos;re a team of
                enthusiasts who genuinely love the products we carry. Every
                listing, every deal, and every recommendation comes from a place
                of real passion and expertise.
              </p>
            </div>
            <AboutStats />
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-b border-border bg-background">
        <Container className="py-16 md:py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Our core values
            </h2>
            <p className="text-muted-foreground">
              These aren&apos;t just words on a wall — they shape every decision
              we make, every product we pick, and every interaction we have.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <Container className="py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to find your next favorite product?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Browse thousands of carefully curated products across top
            categories, with deals updated every day.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-all shadow-lg"
          >
            Start Shopping
          </a>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
