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
export declare const BlogFilters: React.FC<BlogFiltersProps>;
export {};
//# sourceMappingURL=BlogFilters.d.ts.map