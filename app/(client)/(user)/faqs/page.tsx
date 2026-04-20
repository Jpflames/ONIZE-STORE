import Container from "@/components/Container";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqsData } from "@/constants";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs | ONIZE",
  description:
    "Find answers to the most common questions about ONIZE — shipping, returns, orders, and more.",
};

const categories = [
  { label: "All questions", value: "all" },
  { label: "Orders", value: "orders" },
  { label: "Shipping", value: "shipping" },
  { label: "Returns", value: "returns" },
  { label: "Payments", value: "payments" },
];

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <Container className="py-16 md:py-20 relative">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <HelpCircle className="w-7 h-7 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Support
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Browse below or{" "}
                <Link
                  href="/contact"
                  className="text-primary font-semibold hover:underline"
                >
                  reach our support team
                </Link>{" "}
                directly.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* FAQ List */}
      <Container className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            defaultValue="item-0"
          >
            {faqsData.map((faq, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="bg-card border border-border rounded-2xl px-6 overflow-hidden hover:border-primary/30 transition-colors data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary hover:no-underline py-5 gap-3">
                  <span className="flex items-center gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed pl-9">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base mb-1">
                Still have questions?
              </h3>
              <p className="text-sm text-muted-foreground">
                Our support team is available Monday–Friday, 9am–6pm. We
                typically respond within 2 hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-primary text-primary-foreground text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
