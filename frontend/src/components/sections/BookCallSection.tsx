import React, { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Calendar } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/edehchinedu59";

export const BookCallSection: React.FC = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <Section id="call" className="bg-surface/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-display-lg font-serif text-text-primary">
            Let's Talk
          </h2>
          <p className="text-body-md text-text-muted leading-relaxed">
            Have an exciting project in mind? Or just want to discuss ideas? I'm
            always open to meaningful conversations about web development,
            design systems, and innovative solutions.
          </p>

          <ul className="space-y-3">
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
            onClick={() => setIsCalendlyOpen(true)}
            className="mt-8"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule a call
          </Button>
        </motion.div>

        {/* Right: Calendly inline embed */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative h-[580px] rounded-sm border border-border overflow-hidden"
        >
          <iframe
            src={`${CALENDLY_URL}?hide_gdpr_banner=1`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a call with Edeh Chinedu"
          />
        </motion.div>
      </div>

      {/* Calendly Modal */}
      <Modal
        isOpen={isCalendlyOpen}
        onClose={() => setIsCalendlyOpen(false)}
        title="Schedule a Call"
      >
        <div className="h-[600px] rounded-sm overflow-hidden">
          <iframe
            src={`${CALENDLY_URL}?hide_gdpr_banner=1`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a call with Edeh Chinedu"
          />
        </div>
      </Modal>
    </Section>
  );
};
