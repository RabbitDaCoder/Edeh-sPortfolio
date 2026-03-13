import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ChevronLogo } from "../ui/ChevronLogo";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/portfolio";

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = NAV_LINKS;

  const handleNavClick = useCallback(
    (href: string) => {
      setIsMenuOpen(false);

      if (href.startsWith("#")) {
        const anchor = href.slice(1);
        if (isHome) {
          // On home page — scroll to section
          const el = document.getElementById(anchor);
          el?.scrollIntoView({ behavior: "smooth" });
        } else {
          // On other page — navigate home then scroll
          navigate("/");
          setTimeout(() => {
            const el = document.getElementById(anchor);
            el?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        navigate(href);
      }
    },
    [isHome, navigate],
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "h-12 bg-background/80 backdrop-blur-md border-b border-border"
            : "h-16 bg-background/60 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <ChevronLogo size={28} className="text-primary" />
            <span className="text-lg font-serif font-bold tracking-tight text-text-primary">
              Edeh<span className="text-text-muted">.</span>
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span className="hidden sm:inline-block text-[0.65rem] font-mono uppercase tracking-[0.2em] text-text-muted group-hover:text-text-primary transition-colors">
              RabbitDaCoder
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-text-muted hover:text-text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document
                  .getElementById("cv")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden sm:inline-flex"
            >
              Resume
            </Button>
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:bg-surface rounded-sm transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-screen w-64 bg-background border-l border-border flex flex-col"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-8">
                  Menu
                </h2>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleNavClick(link.href)}
                      className="text-left text-text-muted hover:text-text-primary transition-colors py-2 border-b border-border"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                  <Button
                    variant="primary"
                    className="mt-4 w-full"
                    onClick={() => {
                      document
                        .getElementById("cv")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setIsMenuOpen(false);
                    }}
                  >
                    Download Resume
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
