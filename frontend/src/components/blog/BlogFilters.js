import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BlogFilters = ({ categoryGroups, activeCategory, onCategoryChange, }) => {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: _jsx("button", { onClick: () => onCategoryChange(""), className: `px-3 py-1.5 text-xs rounded-sm border transition-colors ${activeCategory === ""
                        ? "bg-accent text-background border-accent"
                        : "border-border text-text-muted hover:text-text-primary hover:border-text-muted/40"}`, children: "All" }) }), categoryGroups.map((group) => (_jsxs("div", { children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.15em] text-text-muted/50 font-mono mb-1.5 block", children: group.label }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: group.categories.map((cat) => (_jsx("button", { onClick: () => onCategoryChange(cat), className: `px-3 py-1.5 text-xs rounded-sm border transition-colors ${activeCategory === cat
                                ? "bg-accent text-background border-accent"
                                : "border-border text-text-muted hover:text-text-primary hover:border-text-muted/40"}`, children: cat }, cat))) })] }, group.label)))] }));
};
//# sourceMappingURL=BlogFilters.js.map