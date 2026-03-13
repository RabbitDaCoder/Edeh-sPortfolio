import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Calendar } from "lucide-react";

const CALENDLY_URL =
  "https://calendly.com/edehchinedu59/new-meeting?hide_event_type_details=1&hide_gdpr_banner=1";

/** Load the Calendly widget script once */
function useCalendlyScript() {
  useEffect(() => {
    if (
      document.querySelector(
        'script[src*="calendly.com/assets/external/widget.css"]',
      )
    )
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
  const Calendly = (window as any).Calendly;
  if (Calendly) {
    Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

export const BookCallSection: React.FC = () => {
  useCalendlyScript();

  return (
    <Section id="call" className="bg-surface/30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <h2 className="text-display-lg font-serif text-text-primary">
          Let's Talk
        </h2>
        <p className="text-body-md text-text-muted leading-relaxed">
          Have an exciting project in mind? Or just want to discuss ideas? I'm
          always open to meaningful conversations about web development, design
          systems, and innovative solutions.
        </p>

        <ul className="flex flex-wrap justify-center gap-6">
          {[
            "30min consultation",
            "No pressure discussions",
            "Coffee on me",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <Button
          variant="primary"
          size="lg"
          magnetic
          onClick={openCalendlyPopup}
          className="mt-8"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule a Meeting
        </Button>
      </motion.div>
    </Section>
  );
};
