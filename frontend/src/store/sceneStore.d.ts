export type SectionId = "hero" | "about" | "skills" | "work" | "career" | "achievements" | "blog" | "books" | "call" | "cv" | "contact";
interface SceneState {
    activeSection: SectionId;
    previousSection: SectionId | null;
    activeProjectIndex: number;
    setActiveSection: (id: SectionId) => void;
    setActiveProjectIndex: (index: number) => void;
}
export declare const useSceneStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SceneState>>;
export {};
//# sourceMappingURL=sceneStore.d.ts.map