export const BLOG_CATEGORY_GROUPS = [
    {
        label: "Tech",
        categories: [
            "Web Development",
            "Backend Engineering",
            "DevOps & Cloud",
            "IoT & Hardware",
            "Blockchain",
        ],
    },
    {
        label: "Life & Personal",
        categories: [
            "Life in Nigeria",
            "Freelancing",
            "Career Growth",
            "Productivity",
            "Health & Wellness",
        ],
    },
    {
        label: "Thought & Culture",
        categories: [
            "Design Thinking",
            "Open Source",
            "Tech Culture",
            "Book Reviews",
            "Hot Takes",
        ],
    },
    {
        label: "Meta",
        categories: ["Behind the Build", "Changelog", "Tutorials", "Case Studies"],
    },
];
export const BLOG_CATEGORIES = BLOG_CATEGORY_GROUPS.flatMap((g) => g.categories);
//# sourceMappingURL=blog.js.map