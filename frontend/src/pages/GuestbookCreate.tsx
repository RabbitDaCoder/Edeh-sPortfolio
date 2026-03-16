import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { GuestbookForm } from "../features/guestbook/components/GuestbookForm";

export function GuestbookCreatePage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sign the Guestbook — Edeh Chinedu</title>
        <meta
          name="description"
          content="Leave a message in Edeh Chinedu's guestbook."
        />
      </Helmet>

      <section className="max-w-2xl mx-auto px-4 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/guestbook")}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to Guestbook
          </button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-accent mb-4">
              <BookOpen size={18} strokeWidth={1.5} />
              <span className="text-xs font-mono uppercase tracking-widest">
                Sign the Guestbook
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
              Leave Your Mark
            </h1>
            <p className="mt-3 text-text-muted max-w-md mx-auto text-sm">
              Share a thought, a kind word, or just say hello.
            </p>
          </div>

          <GuestbookForm />
        </motion.div>
      </section>
    </>
  );
}
