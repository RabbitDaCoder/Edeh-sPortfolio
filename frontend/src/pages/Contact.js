import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
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
import { Copy, Check, Send } from "lucide-react";
import { PERSONAL } from "../data/portfolio";
import { useProfile } from "../features/profile/hooks/useProfile";
import { useSEO } from "../hooks/useSEO";
import { SEO } from "../components/seo/SEO";
import { JsonLD } from "../components/seo/JsonLD";
import { contactPageSchema, breadcrumbSchema } from "../lib/schemas";
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    company: z.string().optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    projectType: z.string().min(1, "Please select a project type"),
    message: z.string().min(10, "Please describe your project (10+ chars)"),
});
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
export const ContactPage = () => {
    const { data: personal = PERSONAL } = useProfile();
    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(contactSchema),
    });
    const contactMutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch("/api/v1/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error("Failed to send message");
            return response.json();
        },
        onSuccess: () => {
            setSubmitted(true);
            reset();
        },
    });
    const onSubmit = (data) => {
        contactMutation.mutate(data);
    };
    const copyEmail = async () => {
        await navigator.clipboard.writeText(personal.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const seo = useSEO({
        title: "Contact — Work With Me",
        description: "Send a project proposal to Edeh Chinedu Daniel. Available for " +
            "freelance web development, IoT consulting, and full-time roles.",
        canonical: "https://edehchinedu.dev/contact",
        ogType: "website",
        keywords: [
            "Hire Full-Stack Developer Nigeria",
            "Freelance Web Developer Enugu",
            "React Developer for Hire",
            "IoT Consultant Nigeria",
            "Contact RabbitDaCoder",
        ],
    });
    return (_jsxs(PageWrapper, { title: "Contact | Edeh Chinedu Daniel", description: "Get in touch about projects, opportunities, or just to chat.", children: [_jsx(SEO, { ...seo }), _jsx(JsonLD, { schema: contactPageSchema() }), _jsx(JsonLD, { schema: breadcrumbSchema([
                    { name: "Home", url: "https://edehchinedu.dev" },
                    { name: "Contact", url: "https://edehchinedu.dev/contact" },
                ]) }), _jsx(Section, { id: "contact", children: _jsxs("div", { className: "space-y-16", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsx("h1", { className: "text-display-xl font-serif text-text-primary mb-4", children: "Let's Build Something" }), _jsx("p", { className: "text-body-lg text-text-muted", children: "Have a project in mind? I'd love to hear about it. Fill out the form below or reach out directly." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16", children: [_jsx("div", { children: _jsx(AnimatePresence, { mode: "wait", children: submitted ? (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "border border-border rounded-md p-12 text-center space-y-6", children: [_jsx("div", { className: "w-16 h-16 rounded-full border-2 border-text-primary flex items-center justify-center mx-auto", children: _jsx(Check, { className: "w-8 h-8 text-text-primary" }) }), _jsx("h2", { className: "text-display-md font-serif text-text-primary", children: "Message Sent" }), _jsx("p", { className: "text-text-muted max-w-md mx-auto", children: "Thanks for reaching out. I'll review your proposal and get back to you within 48 hours." }), _jsx(Button, { variant: "outline", onClick: () => setSubmitted(false), children: "Send another" })] }, "success")) : (_jsxs(motion.form, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsx(Input, { label: "Name", placeholder: "Your name", error: errors.name?.message, ...register("name") }), _jsx(Input, { label: "Email", type: "email", placeholder: "you@company.com", error: errors.email?.message, ...register("email") })] }), _jsx(Input, { label: "Company", placeholder: "Company (optional)", ...register("company") }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-body-sm font-medium text-text-primary", children: "Project Type" }), _jsx("div", { className: "flex flex-wrap gap-2", children: PROJECT_TYPES.map((type) => (_jsxs("label", { className: "cursor-pointer", children: [_jsx("input", { type: "radio", value: type, className: "sr-only peer", ...register("projectType") }), _jsx("span", { className: "inline-block px-3 py-1.5 text-xs border border-border rounded-sm text-text-muted peer-checked:bg-accent peer-checked:text-background peer-checked:border-accent transition-colors hover:border-text-muted/40", children: type })] }, type))) }), errors.projectType && (_jsx("p", { className: "text-body-sm text-text-primary font-medium", children: errors.projectType.message }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-body-sm font-medium text-text-primary", children: "Budget Range" }), _jsxs("select", { className: "w-full px-3 py-2.5 text-body-md border border-border rounded-md bg-transparent text-text-primary focus:border-text-primary focus:outline-none", ...register("budget"), children: [_jsx("option", { value: "", children: "Select budget" }), BUDGET_RANGES.map((b) => (_jsx("option", { value: b, children: b }, b)))] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-body-sm font-medium text-text-primary", children: "Timeline" }), _jsxs("select", { className: "w-full px-3 py-2.5 text-body-md border border-border rounded-md bg-transparent text-text-primary focus:border-text-primary focus:outline-none", ...register("timeline"), children: [_jsx("option", { value: "", children: "Select timeline" }), TIMELINES.map((t) => (_jsx("option", { value: t, children: t }, t)))] })] })] }), _jsx(Textarea, { label: "Project Details", placeholder: "Tell me about your project, goals, and any specific requirements...", rows: 6, error: errors.message?.message, ...register("message") }), _jsx(Button, { variant: "primary", size: "lg", type: "submit", disabled: contactMutation.isPending, magnetic: true, className: "w-full sm:w-auto", children: contactMutation.isPending ? ("Sending...") : (_jsxs(_Fragment, { children: ["Send Proposal", _jsx(Send, { className: "w-4 h-4 ml-2" })] })) }), contactMutation.isError && (_jsx("p", { className: "text-body-sm text-text-primary", children: "Something went wrong. Please try again or email directly." }))] }, "form")) }) }), _jsxs("aside", { className: "space-y-8", children: [_jsxs("div", { className: "border border-border rounded-md p-6 space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-text-primary", children: "Direct Contact" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-muted uppercase tracking-wide", children: "Email" }), _jsx("p", { className: "text-sm text-text-primary font-mono", children: personal.email })] }), _jsx("button", { onClick: copyEmail, className: "p-2 text-text-muted hover:text-text-primary transition-colors", title: "Copy email", children: copied ? (_jsx(Check, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-muted uppercase tracking-wide", children: "Location" }), _jsx("p", { className: "text-sm text-text-primary", children: personal.location })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-muted uppercase tracking-wide", children: "Response Time" }), _jsx("p", { className: "text-sm text-text-primary", children: "Within 48 hours" })] })] })] }), _jsxs("div", { className: "border border-border rounded-md p-6 space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-text-primary", children: "What Happens Next" }), _jsx("ol", { className: "space-y-3", children: [
                                                        "I review your proposal details",
                                                        "We schedule a discovery call",
                                                        "I send a detailed project plan",
                                                        "We kick off the project",
                                                    ].map((step, i) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "w-6 h-6 shrink-0 rounded-full border border-border flex items-center justify-center text-xs text-text-muted font-mono", children: i + 1 }), _jsx("span", { className: "text-sm text-text-muted", children: step })] }, step))) })] }), _jsxs("div", { className: "border border-border rounded-md p-6 space-y-3", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(Badge, { variant: "pulse", className: "text-xs", children: "Available" }) }), _jsx("p", { className: "text-sm text-text-muted", children: "Currently accepting new projects. Let's discuss how I can help bring your vision to life." })] })] })] })] }) })] }));
};
//# sourceMappingURL=Contact.js.map