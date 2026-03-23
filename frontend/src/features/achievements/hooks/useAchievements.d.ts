interface AchievementEntry {
    id: string;
    title: string;
    description?: string;
    date?: string;
    order: number;
    createdAt: string;
}
export declare const useAchievementsKey: {
    all: readonly ["achievements"];
};
export declare function useAchievements(): import("@tanstack/react-query").UseQueryResult<AchievementEntry[], Error>;
export {};
//# sourceMappingURL=useAchievements.d.ts.map