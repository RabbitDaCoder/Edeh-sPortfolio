import React from "react";
import { Badge } from "../ui/Badge";

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange("")}
        className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
          activeCategory === ""
            ? "bg-accent text-background border-accent"
            : "border-border text-text-muted hover:text-text-primary hover:border-text-muted/40"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
            activeCategory === cat
              ? "bg-accent text-background border-accent"
              : "border-border text-text-muted hover:text-text-primary hover:border-text-muted/40"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
