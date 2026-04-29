"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Mail, User, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createContactMessage } from "@/actions/contact.actions";
import toast from "react-hot-toast";

const ContactPage = () => {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user, isLoaded]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await createContactMessage(formData);
      if (result.success) {
        toast.success("Message sent successfully!");
        setFormData((prev) => ({ ...prev, message: "" }));
        setErrors({});
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-white min-h-screen py-20 mt-10">
      <Container>
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div>
              <Title className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Let&apos;s start a{" "}
                <span className="text-primary italic">conversation</span>
              </Title>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you have a question about features, trials, pricing, or
                anything else, our team is ready to answer all your questions.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-5 p-6 rounded-2xl bg-muted/30 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chat to us</p>
                  <p className="font-bold text-lg">support@onize.com</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-6 rounded-2xl bg-muted/30 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Office</p>
                  <p className="font-bold text-lg">
                    Minner, Niger state, Nigeria
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Quick Response
              </p>
              <p className="text-muted-foreground text-sm">
                Our typical response time is within 24 hours during business
                days. We appreciate your patience!
              </p>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border/60">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold ml-1">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`h-14 px-6 rounded-2xl border-border/60 bg-muted/10 focus-visible:ring-primary/20 transition-all ${errors.name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold ml-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`h-14 px-6 rounded-2xl border-border/60 bg-muted/10 focus-visible:ring-primary/20 transition-all ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-semibold ml-1"
                  >
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className={`px-6 py-4 rounded-3xl border-border/60 bg-muted/10 focus-visible:ring-primary/20 transition-all resize-none ${errors.message ? "border-red-500" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white h-16 rounded-2xl font-bold hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 group hoverEffect"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
