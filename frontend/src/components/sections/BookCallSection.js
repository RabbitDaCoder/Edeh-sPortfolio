import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Calendar } from "lucide-react";
const CALENDLY_URL = "https://calendly.com/edehchinedu59/new-meeting?hide_event_type_details=1&hide_gdpr_banner=1";
/** Load the Calendly widget script once */
function useCalendlyScript() {
    useEffect(() => {
        if (document.querySelector('script[src*="calendly.com/assets/external/widget.css"]'))
            return;
        const link = document.createElement("link");
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);
}
function openCalendlyPopup() {
    const Calendly = window.Calendly;
    if (Calendly) {
        Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
}
export const BookCallSection = () => {
    useCalendlyScript();
    return (_jsx(Section, { id: "call", className: "bg-surface/30", children: _jsxs(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 }, className: "max-w-2xl mx-auto text-center space-y-6", children: [_jsx("h2", { className: "text-display-lg font-serif text-text-primary", children: "Let's Talk" }), _jsx("p", { className: "text-body-md text-text-muted leading-relaxed", children: "Have an exciting project in mind? Or just want to discuss ideas? I'm always open to meaningful conversations about web development, design systems, and innovative solutions." }), _jsx("ul", { className: "flex flex-wrap justify-center gap-6", children: [
                        "30min consultation",
                        "No pressure discussions",
                        "Coffee on me",
                    ].map((item) => (_jsxs("li", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-accent" }), _jsx("span", { className: "text-text-muted", children: item })] }, item))) }), _jsxs(Button, { variant: "primary", size: "lg", magnetic: true, onClick: openCalendlyPopup, className: "mt-8", children: [_jsx(Calendar, { className: "w-4 h-4 mr-2" }), "Schedule a Meeting"] })] }) }));
};
//# sourceMappingURL=BookCallSection.js.map