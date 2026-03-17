import React from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";
import { CV } from "../../data/portfolio";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const CvDownloadSection: React.FC = () => {
  return (
    <Section id="cv" className="min-h-64 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div>
          <h2 className="text-display-lg font-serif text-text-primary mb-2">
            My Resume
          </h2>
          <p className="text-text-muted">
            Download my full CV to see the complete picture of my experience,
            skills, and achievements.
          </p>
        </div>

        <a href="/Resume.pdf" download={CV.filename} rel="noopener noreferrer">
          <Button variant="primary" size="lg" magnetic className="inline-flex">
            <Download className="w-4 h-4 mr-2" />
            Download {CV.label}
          </Button>
        </a>
      </motion.div>
    </Section>
  );
};
