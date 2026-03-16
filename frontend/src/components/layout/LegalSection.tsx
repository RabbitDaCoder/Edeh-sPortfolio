import { motion } from "framer-motion";

type SectionProps = {
  number: string;
  heading: string;
  children: React.ReactNode;
};

export function LegalSection({ number, heading, children }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: "3rem" }}
    >
      {/* Section number + heading */}
      <div
        className="flex items-baseline gap-4 mb-4"
        style={{
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "0.75rem",
        }}
      >
        <span
          className="font-mono text-label text-muted"
          style={{ minWidth: "2rem" }}
        >
          {number}
        </span>
        <h2 className="font-display text-display-md text-text-primary">
          {heading}
        </h2>
      </div>

      {/* Section content */}
      <div
        className="font-body text-body-md text-muted leading-relaxed"
        style={{ paddingLeft: "3rem" }}
      >
        {children}
      </div>
    </motion.section>
  );
}

/** A paragraph of legal prose */
export function LP({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: "1rem", lineHeight: 1.8 }}>{children}</p>;
}

/** An unordered list */
export function LList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "0.5rem 0 1rem",
        paddingLeft: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ lineHeight: 1.7 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A highlighted callout box */
export function LCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--color-text-primary)",
        paddingLeft: "1rem",
        margin: "1.25rem 0",
        opacity: 0.8,
      }}
    >
      {children}
    </div>
  );
}

/** A contact email link */
export function LEmail() {
  return (
    <a
      href="mailto:edehchinedu59@gmail.com"
      style={{
        color: "var(--color-text-primary)",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
    >
      edehchinedu59@gmail.com
    </a>
  );
}
