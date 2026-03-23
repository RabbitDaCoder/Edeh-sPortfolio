type SectionProps = {
    number: string;
    heading: string;
    children: React.ReactNode;
};
export declare function LegalSection({ number, heading, children }: SectionProps): import("react/jsx-runtime").JSX.Element;
/** A paragraph of legal prose */
export declare function LP({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** An unordered list */
export declare function LList({ items }: {
    items: string[];
}): import("react/jsx-runtime").JSX.Element;
/** A highlighted callout box */
export declare function LCallout({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** A contact email link */
export declare function LEmail(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LegalSection.d.ts.map