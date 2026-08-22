interface CareerEntry {
    id: string;
    type: "EDUCATION" | "JOB" | "FREELANCE" | "VOLUNTEER" | "ACHIEVEMENT" | "PLAN" | "BLOCKCHAIN" | "FOUNDER";
    title: string;
    organisation?: string;
    description?: string;
    date?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    points?: string[];
    keySkills?: string[];
    order?: number;
}
export declare const useCareerKey: {
    all: readonly ["career"];
    detail: (type?: string) => string[] | readonly ["career"];
};
export declare function useCareerTimeline(type?: string): import("@tanstack/react-query").UseQueryResult<CareerEntry[], Error>;
export {};
//# sourceMappingURL=useCareer.d.ts.map