import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Section } from "../components/layout/Section";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Copy, Check, Send, ArrowRight } from "lucide-react";
import { PERSONAL } from "../data/portfolio";
import { useProfile } from "../features/profile/hooks/useProfile";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Please describe your project (10+ chars)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const PROJECT_TYPES = [
  "Full-stack Application",
  "Frontend Development",
  "3D / WebGL Experience",
  "Design System",
  "Performance Audit",
  "Consulting",
  "Other",
];

const BUDGET_RANGES = [
  "Under $5K",
  "$5K - $15K",
  "$15K - $50K",
  "$50K+",
  "Let's discuss",
];

const TIMELINES = ["ASAP", "1-2 months", "3-6 months", "6+ months", "Flexible"];

export const ContactPage: React.FC = () => {
  const { data: personal = PERSONAL } = useProfile();
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper
      title="Contact | Edeh Chinedu Daniel"
      description="Get in touch about projects, opportunities, or just to chat."
    >
      <Section id="contact">
        <div className="space-y-16">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-display-xl font-serif text-text-primary mb-4">
              Let&apos;s Build Something
            </h1>
            <p className="text-body-lg text-text-muted">
              Have a project in mind? I&apos;d love to hear about it. Fill out
              the form below or reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
            {/* Left: Form */}
            <div>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-border rounded-md p-12 text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-text-primary flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-text-primary" />
                    </div>
                    <h2 className="text-display-md font-serif text-text-primary">
                      Message Sent
                    </h2>
                    <p className="text-text-muted max-w-md mx-auto">
                      Thanks for reaching out. I&apos;ll review your proposal
                      and get back to you within 48 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Basic info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Name"
                        placeholder="Your name"
                        error={errors.name?.message}
                        {...register("name")}
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@company.com"
                        error={errors.email?.message}
                        {...register("email")}
                      />
                    </div>

                    <Input
                      label="Company"
                      placeholder="Company (optional)"
                      {...register("company")}
                    />

                    {/* Project type */}
                    <div className="space-y-3">
                      <label className="text-body-sm font-medium text-text-primary">
                        Project Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PROJECT_TYPES.map((type) => (
                          <label key={type} className="cursor-pointer">
                            <input
                              type="radio"
                              value={type}
                              className="sr-only peer"
                              {...register("projectType")}
                            />
                            <span className="inline-block px-3 py-1.5 text-xs border border-border rounded-sm text-text-muted peer-checked:bg-accent peer-checked:text-background peer-checked:border-accent transition-colors hover:border-text-muted/40">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.projectType && (
                        <p className="text-body-sm text-text-primary font-medium">
                          {errors.projectType.message}
                        </p>
                      )}
                    </div>

                    {/* Budget & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-body-sm font-medium text-text-primary">
                          Budget Range
                        </label>
                        <select
                          className="w-full px-3 py-2.5 text-body-md border border-border rounded-md bg-transparent text-text-primary focus:border-text-primary focus:outline-none"
                          {...register("budget")}
                        >
                          <option value="">Select budget</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-body-sm font-medium text-text-primary">
                          Timeline
                        </label>
                        <select
                          className="w-full px-3 py-2.5 text-body-md border border-border rounded-md bg-transparent text-text-primary focus:border-text-primary focus:outline-none"
                          {...register("timeline")}
                        >
                          <option value="">Select timeline</option>
                          {TIMELINES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <Textarea
                      label="Project Details"
                      placeholder="Tell me about your project, goals, and any specific requirements..."
                      rows={6}
                      error={errors.message?.message}
                      {...register("message")}
                    />

                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={contactMutation.isPending}
                      magnetic
                      className="w-full sm:w-auto"
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Proposal
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {contactMutation.isError && (
                      <p className="text-body-sm text-text-primary">
                        Something went wrong. Please try again or email
                        directly.
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Info sidebar */}
            <aside className="space-y-8">
              {/* Direct contact */}
              <div className="border border-border rounded-md p-6 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Direct Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm text-text-primary font-mono">
                        {personal.email}
                      </p>
                    </div>
                    <button
                      onClick={copyEmail}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                      title="Copy email"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-sm text-text-primary">
                      {personal.location} ({personal.timezone})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">
                      Response Time
                    </p>
                    <p className="text-sm text-text-primary">Within 48 hours</p>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="border border-border rounded-md p-6 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  What Happens Next
                </h3>
                <ol className="space-y-3">
                  {[
                    "I review your proposal details",
                    "We schedule a discovery call",
                    "I send a detailed project plan",
                    "We kick off the project",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full border border-border flex items-center justify-center text-xs text-text-muted font-mono">
                        {i + 1}
                      </span>
                      <span className="text-sm text-text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Availability */}
              <div className="border border-border rounded-md p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="pulse" className="text-xs">
                    Available
                  </Badge>
                </div>
                <p className="text-sm text-text-muted">
                  Currently accepting new projects. Let&apos;s discuss how I can
                  help bring your vision to life.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
};
