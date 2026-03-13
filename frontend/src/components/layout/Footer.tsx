import React from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { PERSONAL } from "../../data/portfolio";
import { useProfile } from "../../features/profile/hooks/useProfile";

export const Footer: React.FC = () => {
  const { data: personal = PERSONAL } = useProfile();
  const currentYear = new Date().getFullYear();
  const fullName = `${personal.name.first} ${personal.name.middle} ${personal.name.last}`;

  const socialLinks = [
    {
      icon: Github,
      href: personal.github,
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: personal.linkedin,
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: personal.twitter,
      label: "Twitter",
    },
    {
      icon: Mail,
      href: `mailto:${personal.email}`,
      label: "Email",
    },
  ];

  return (
    <footer className="bg-background border-t border-border mt-spacing-section">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-text-primary mb-2">
              {fullName}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {personal.tagline}
            </p>
          </div>

          {/* Center Column */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2">
              {["About", "Work", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Social */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Connect
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-sm transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bottom */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} {fullName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
