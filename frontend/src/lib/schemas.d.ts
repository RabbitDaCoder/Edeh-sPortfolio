export declare function personSchema(): {
    "@context": string;
    logo: {
        "@type": string;
        url: string;
    };
    "@type": "Person";
    "@id": "https://edehchinedu.dev/#person";
    name: "Edeh Chinedu Daniel";
    alternateName: "RabbitDaCoder";
    url: "https://edehchinedu.dev";
    email: "edehchinedu59@gmail.com";
    jobTitle: "Full-Stack Software Engineer & Digital Creator";
    description: string;
    image: "https://edehchinedu.dev/og-default.jpg";
    sameAs: readonly ["https://github.com/RabbitDaCoder", "https://linkedin.com/in/edehchinedu20", "https://www.youtube.com/@rabbitdacoder", "https://x.com/EdehChinedu20"];
    knowsAbout: readonly ["React", "Node.js", "TypeScript", "Three.js", "GSAP", "PostgreSQL", "Go", "Docker", "IoT", "REST API"];
    address: {
        readonly "@type": "PostalAddress";
        readonly addressLocality: "Enugu";
        readonly addressCountry: "NG";
    };
};
export declare function websiteSchema(): {
    "@context": string;
    "@type": string;
    name: string;
    url: "https://edehchinedu.dev";
    description: string;
    author: {
        "@id": "https://edehchinedu.dev";
    };
    potentialAction: {
        "@type": string;
        target: {
            "@type": string;
            urlTemplate: string;
        };
        "query-input": string;
    };
};
export declare function blogPostSchema(post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt?: string;
    readTime: number;
}): {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string;
    url: string;
    datePublished: string;
    dateModified: string;
    author: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
    };
    publisher: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
        logo: {
            "@type": string;
            url: string;
        };
    };
    mainEntityOfPage: {
        "@type": string;
        "@id": string;
    };
    articleSection: string;
    keywords: string;
    timeRequired: string;
    inLanguage: string;
    about: {
        "@type": string;
        name: string;
    };
};
export declare function bookSchema(book: {
    title: string;
    slug: string;
    description: string;
    coverImage?: string | null;
    author?: string;
    price?: number;
    currency?: string;
    publishedAt?: string;
    tags?: string[];
    url?: string;
}): {
    inLanguage: string;
    keywords?: string | undefined;
    offers?: {
        "@type": string;
        price: number;
        priceCurrency: string;
        availability: string;
        url: string;
    } | undefined;
    datePublished?: string | undefined;
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    image: string;
    url: string;
    author: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
    };
};
export declare function breadcrumbSchema(items: {
    name: string;
    url: string;
}[]): {
    "@context": string;
    "@type": string;
    itemListElement: {
        "@type": string;
        position: number;
        name: string;
        item: string;
    }[];
};
export declare function projectSchema(project: {
    name: string;
    slug: string;
    description: string;
    tags: string[];
    coverImage?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
}): {
    image: string;
    programmingLanguage: string;
    author: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
    };
    codeRepository?: string | undefined;
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    url: string;
};
export declare function collectionPageSchema(page: {
    name: string;
    description: string;
    url: string;
    items: {
        name: string;
        url: string;
    }[];
}): {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    url: string;
    mainEntity: {
        "@type": string;
        numberOfItems: number;
        itemListElement: {
            "@type": string;
            position: number;
            name: string;
            url: string;
        }[];
    };
};
export declare function contactPageSchema(): {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description: string;
    mainEntity: {
        contactPoint: {
            "@type": string;
            email: string;
            contactType: string;
            availableLanguage: string;
        };
        name: "Edeh Chinedu Daniel";
        alternateName: "RabbitDaCoder";
        url: "https://edehchinedu.dev";
        email: "edehchinedu59@gmail.com";
        jobTitle: "Full-Stack Software Engineer & Digital Creator";
        description: string;
        image: "https://edehchinedu.dev/og-default.jpg";
        sameAs: readonly ["https://github.com/RabbitDaCoder", "https://linkedin.com/in/edehchinedu20", "https://www.youtube.com/@rabbitdacoder", "https://x.com/EdehChinedu20"];
        knowsAbout: readonly ["React", "Node.js", "TypeScript", "Three.js", "GSAP", "PostgreSQL", "Go", "Docker", "IoT", "REST API"];
        address: {
            readonly "@type": "PostalAddress";
            readonly addressLocality: "Enugu";
            readonly addressCountry: "NG";
        };
        "@context": string;
        "@type": string;
    };
};
export declare function buildArticleSchema(post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    category?: string;
    tags?: string[];
    createdAt: string | Date;
    updatedAt?: string | Date;
    readTime?: number;
}): {
    timeRequired?: string | undefined;
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string[];
    datePublished: string;
    dateModified: string;
    author: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
        sameAs: string[];
    };
    publisher: {
        "@type": string;
        name: string;
        url: "https://edehchinedu.dev";
    };
    mainEntityOfPage: {
        "@type": string;
        "@id": string;
    };
    keywords: string;
    articleSection: string;
    wordCount: number;
};
export declare function buildBooksListSchema(books: Array<{
    title: string;
    slug: string;
    coverImage?: string | null;
    description: string;
}>): {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    itemListElement: {
        "@type": string;
        position: number;
        name: string;
        url: string;
        image: string | null | undefined;
        description: string;
    }[];
};
//# sourceMappingURL=schemas.d.ts.map