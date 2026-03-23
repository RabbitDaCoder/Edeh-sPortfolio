import { create } from "zustand";
export const useSceneStore = create((set, get) => ({
    activeSection: "hero",
    previousSection: null,
    activeProjectIndex: 0,
    setActiveSection: (id) => set({ activeSection: id, previousSection: get().activeSection }),
    setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),
}));
//# sourceMappingURL=sceneStore.js.map