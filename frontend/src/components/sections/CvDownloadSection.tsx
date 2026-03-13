import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";
import { CV } from "../../data/portfolio";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

interface DownloadItem {
  id: string;
  label: string;
  fileUrl: string;
  downloads: number;
  active: boolean;
}

export const CvDownloadSection: React.FC = () => {
  const [dl, setDl] = useState<DownloadItem | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/downloads`)
      .then((r) => r.json())
      .then((res) => {
        const items: DownloadItem[] = res?.data ?? [];
        if (items.length > 0) setDl(items[0]);
      })
      .catch(() => {});
  }, []);

  const handleDownload = () => {
    if (dl) {
      // Optimistic update
      setDl({ ...dl, downloads: dl.downloads + 1 });

      // Download via backend proxy which sets Content-Disposition: attachment
      // (also records the download server-side)
      const link = document.createElement("a");
      link.href = `${API_URL}/downloads/${dl.id}/file`;
      link.download = dl.label || "CV";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback to static file
      const link = document.createElement("a");
      link.href = CV.publicPath;
      link.download = CV.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

        <Button
          variant="primary"
          size="lg"
          magnetic
          onClick={handleDownload}
          className="inline-flex"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {dl?.label || "CV"}
        </Button>

        {dl && (
          <p className="text-xs text-text-muted/60">
            {dl.downloads > 0
              ? `Downloaded ${dl.downloads.toLocaleString()} time${dl.downloads === 1 ? "" : "s"}`
              : "Be the first to download!"}
          </p>
        )}
      </motion.div>
    </Section>
  );
};
