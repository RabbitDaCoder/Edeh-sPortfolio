import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const article = document.getElementById("article-body");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY;

      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;
      const current = scrolled - start;
      const percent = Math.min(100, Math.max(0, (current / end) * 100));
      setProgress(percent);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "2px",
        background: "var(--color-text-primary, #F5F5F5)",
        zIndex: 100,
        transition: "width 0.1s linear",
        opacity: progress > 0 ? 1 : 0,
      }}
    />
  );
}
