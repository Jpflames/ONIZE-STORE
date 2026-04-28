"use client";

import React from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  Truck,
  RefreshCcw,
  Landmark,
  ShieldCheck,
} from "lucide-react";

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "Once your order has shipped, you will receive an email with a tracking number and a link to track your package. You can also view your order status in your account dashboard under 'My Orders'.",
      icon: <Truck className="w-5 h-5 text-primary" />,
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. The product must be in its original packaging and unused. Some items, such as intimate apparel or customized goods, are not eligible for return. Please visit our 'Returns' section for more details.",
      icon: <RefreshCcw className="w-5 h-5 text-primary" />,
    },
    {
      question: "Which payment methods do you accept?",
      answer:
        "We accept major cards and other supported payment methods. All transactions are securely processed through Flutterwave.",
      icon: <Landmark className="w-5 h-5 text-primary" />,
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Yes, we take security very seriously. We use industry-standard encryption to protect your data and do not store any credit card information on our servers. All payments are handled by Flutterwave.",
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20 mt-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <Title className="text-4xl md:text-5xl font-extrabold mb-4">
              How can we help you?
            </Title>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions, learn about our policies, or get
              in touch with our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-b pb-4">
                Frequently Asked Questions
              </h3>
              <Accordion
                type="single"
                collapsible
                defaultValue="item-0"
                className="w-full"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b-border/60"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left font-semibold">
                        {faq.icon}
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pl-9">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact & Info Section */}
            <div className="space-y-12">
              <div className="bg-muted/30 p-8 rounded-3xl border border-border/50">
                <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-border/40">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Email Support</p>
                      <p className="text-muted-foreground">support@onize.com</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Response time: within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-border/40">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Phone Support</p>
                      <p className="text-muted-foreground">+1 (555) 000-0000</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available Mon-Fri, 9am - 6pm EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Support Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-muted-foreground italic text-xs">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                    <span className="font-medium">Saturday</span>
                    <span className="text-muted-foreground italic text-xs">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Sunday</span>
                    <span className="text-red-500 font-semibold text-xs tracking-wider uppercase">
                      Closed
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                  *Our support team is closed on national holidays. Emails sent
                  during off-hours will be addressed on the next business day.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 p-10 bg-black text-white rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">
                Still have questions?
              </h3>
              <p className="text-white/60">
                Can&apos;t find the answer you&apos;re looking for? Please chat
                to our friendly team.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-white/90 transition-all hoverEffect active:scale-95 whitespace-nowrap"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

import Link from "next/link";

export default HelpPage;
