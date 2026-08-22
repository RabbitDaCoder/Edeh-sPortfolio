export interface Profile {
    name: string;
    alias?: string;
    tagline?: string;
    subTagline?: string;
    fullHeadline?: string;
    bio: string[];
    pullQuote?: string;
    availability?: string;
    email: string;
    phone?: string;
    location?: string;
    locationShort?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    portfolio?: string;
    calendly?: string;
}
export declare const useProfileKey: {
    all: readonly ["profile"];
};
export declare function useProfile(): import("@tanstack/react-query").UseQueryResult<Profile | null, Error>;
//# sourceMappingURL=useProfile.d.ts.map