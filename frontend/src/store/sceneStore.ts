import { create } from "zustand";

export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "work"
  | "career"
  | "achievements"
  | "blog"
  | "books"
  | "call"
  | "cv"
  | "contact";

interface SceneState {
  activeSection: SectionId;
  previousSection: SectionId | null;
  activeProjectIndex: number;

  setActiveSection: (id: SectionId) => void;
  setActiveProjectIndex: (index: number) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  activeSection: "hero",
  previousSection: null,
  activeProjectIndex: 0,

  setActiveSection: (id) =>
    set({ activeSection: id, previousSection: get().activeSection }),
  setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),
}));
