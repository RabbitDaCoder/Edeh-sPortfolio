import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { useProfile } from "../../features/profile/hooks/useProfile";
export const AboutSection = () => {
  const { data: personal } = useProfile();
  if (!personal) return null;
  const bio = personal.bio;
  const pullQuote = personal.pullQuote;
  return _jsx(Section, {
    id: "about",
    className: "bg-surface/30",
    children: _jsx("div", {
      className: "grid grid-cols-1 gap-12 items-start",
      children: _jsxs("div", {
        className: "space-y-6",
        children: [
          _jsxs(motion.h2, {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className:
              "text-display-lg font-serif text-text-primary leading-[1.1]",
            children: [
              "Engineer.",
              _jsx("br", {}),
              "Creator.",
              _jsx("br", {}),
              _jsx("span", {
                className: "text-text-muted",
                children: "Builder.",
              }),
            ],
          }),
          _jsxs(motion.div, {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6, delay: 0.15 },
            className: "space-y-4 text-text-muted leading-relaxed",
            children: [
              _jsx("p", { children: bio[0] }),
              _jsx("p", { children: bio[1] }),
            ],
          }),
          _jsx(motion.div, {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: 0.3 },
            children: _jsx(Card, {
              className: "border-l-4 border-l-accent pl-6 py-4",
              children: _jsxs("blockquote", {
                className: "italic text-text-primary",
                children: ["\u201C", pullQuote, "\u201D"],
              }),
            }),
          }),
        ],
      }),
    }),
  });
};
//# sourceMappingURL=AboutSection.js.map
