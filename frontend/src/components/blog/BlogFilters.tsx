import React from "react";

interface CategoryGroup {
  readonly label: string;
  readonly categories: readonly string[];
}

interface BlogFiltersProps {
  categoryGroups: readonly CategoryGroup[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  categoryGroups,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-4">
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
      </div>

      {categoryGroups.map((group) => (
        <div key={group.label}>
          <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted/50 font-mono mb-1.5 block">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.categories.map((cat) => (
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
        </div>
      ))}
    </div>
  );
};
