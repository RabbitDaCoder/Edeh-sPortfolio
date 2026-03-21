import { useState, useCallback } from "react";
import { Twitter, Facebook, Instagram, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildTwitterShare,
  buildFacebookShare,
  buildFacebookCaption,
  buildInstagramCaption,
  buildWhatsAppShare,
} from "../../utils/share";

interface ShareBarProps {
  title: string;
  slug: string;
}

export default function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary font-medium">Share:</span>

      {/* Twitter / X */}
      <button
        onClick={() => openInNewTab(buildTwitterShare(title, slug))}
        className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} strokeWidth={1.5} />
      </button>

      {/* Facebook — copy caption then open share dialog */}
      <button
        onClick={async () => {
          await copyToClipboard(buildFacebookCaption(title, slug), "facebook");
          openInNewTab(buildFacebookShare(slug));
        }}
        className="relative p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors"
        aria-label="Share on Facebook (caption copied to clipboard)"
      >
        <Facebook size={18} strokeWidth={1.5} />
        <AnimatePresence>
          {copied === "facebook" && <CopiedBadge />}
        </AnimatePresence>
      </button>

      {/* Instagram — copy caption */}
      <button
        onClick={() =>
          copyToClipboard(buildInstagramCaption(title, slug), "instagram")
        }
        className="relative p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors"
        aria-label="Copy Instagram caption"
      >
        <Instagram size={18} strokeWidth={1.5} />
        <AnimatePresence>
          {copied === "instagram" && <CopiedBadge />}
        </AnimatePresence>
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => openInNewTab(buildWhatsAppShare(title, slug))}
        className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors"
        aria-label="Share on WhatsApp"
      >
        <Share2 size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function CopiedBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-accent text-background px-1.5 py-0.5 rounded whitespace-nowrap"
    >
      Copied!
    </motion.span>
  );
}
