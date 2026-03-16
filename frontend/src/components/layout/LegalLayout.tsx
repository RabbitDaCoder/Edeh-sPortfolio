import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalLayout({
  title,
  description,
  lastUpdated,
  children,
}: Props) {
  return (
    <>
      <Helmet>
        <title>{title} — Edeh Chinedu Daniel</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div
        className="min-h-screen bg-background"
        style={{ paddingTop: "80px" }}
      >
        {/* Page header */}
        <div
          className="border-b border-border bg-surface/50"
          style={{ padding: "3rem 0 2.5rem" }}
        >
          <div className="max-w-3xl mx-auto" style={{ padding: "0 1.5rem" }}>
            {/* Back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-label text-muted hover:text-text-primary transition-colors duration-200 mb-6"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to portfolio
            </Link>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="font-display text-display-xl text-text-primary leading-tight"
            >
              {title}
            </motion.h1>

            {/* Last updated */}
            <p className="font-mono text-label text-muted mt-3">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
          style={{ padding: "3rem 1.5rem 6rem" }}
        >
          {children}
        </motion.div>

        {/* Footer strip */}
        <div
          className="border-t border-border"
          style={{ padding: "2rem 1.5rem" }}
        >
          <div className="max-w-3xl mx-auto flex flex-wrap gap-6 justify-between items-center">
            <p className="font-mono text-label text-muted">
              © {new Date().getFullYear()} Edeh Chinedu Daniel. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="font-mono text-label text-muted hover:text-text-primary transition-colors"
                style={{ textDecoration: "none" }}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-mono text-label text-muted hover:text-text-primary transition-colors"
                style={{ textDecoration: "none" }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
