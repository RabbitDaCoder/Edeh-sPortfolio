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
  hoveredSkill: string | null;
  activeProjectIndex: number;
  activeCareerNode: number;
  isLoaded: boolean;

  setActiveSection: (id: SectionId) => void;
  setHoveredSkill: (skill: string | null) => void;
  setActiveProjectIndex: (index: number) => void;
  setActiveCareerNode: (index: number) => void;
  setIsLoaded: (loaded: boolean) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  activeSection: "hero",
  previousSection: null,
  hoveredSkill: null,
  activeProjectIndex: 0,
  activeCareerNode: 0,
  isLoaded: false,

  setActiveSection: (id) =>
    set({ activeSection: id, previousSection: get().activeSection }),
  setHoveredSkill: (skill) => set({ hoveredSkill: skill }),
  setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),
  setActiveCareerNode: (index) => set({ activeCareerNode: index }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
}));
