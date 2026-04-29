import Container from "@/components/Container";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Onize Crochets",
  description:
    "Meet the maker behind Onize Crochets — handcrafted crochet bags made with intention, creativity, and quiet elegance.",
};

const AboutPage = () => {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Container className="py-16 md:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Meet the Maker
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                Hi, my name is{" "}
                <span className="text-primary">Gloria Bukayo O.</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-5">
                A creative entrepreneur and crochet artist, and the founder of
                Onize Crochets.
              </p>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  What began as a passion for handmade crafts has grown into a
                  brand rooted in intention, creativity, and quiet elegance.
                  Each piece I create is thoughtfully designed and carefully
                  handcrafted, stitch by stitch.
                </p>
                <p>
                  At Onize Crochets, I work exclusively with{" "}
                  <span className="font-semibold text-foreground">
                    high-quality yarn and carefully selected materials
                  </span>{" "}
                  to ensure every bag is not only beautiful, but durable and
                  made to last. Every detail matters from structure to finish
                  because I believe the things you carry should feel just as
                  good as they look.
                </p>
                <p>
                  This brand is more than crochet. It is a reflection of
                  patience, artistry, and the desire to create pieces that feel
                  personal and timeless.
                </p>
                <p>
                  Every bag is made with you in mind, your style, your presence,
                  your confidence.
                </p>
              </div>
              <div className="mt-8 inline-flex flex-col gap-1">
                <p className="font-black tracking-tight text-foreground">
                  Onize Crochets
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Handcrafted with intention. Designed to stand out.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted/20">
                  <Image
                    src="/images/Gloria.jpeg"
                    alt="Portrait of Gloria Bukayo O., Founder of Onize Crochets"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    Founder
                  </p>
                  <p className="text-lg font-black tracking-tight">
                    Gloria Bukayo O.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Creative entrepreneur • Crochet artist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
