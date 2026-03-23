import { SectionId } from "../store/sceneStore";
/**
 * Attach to each Section wrapper. Uses IntersectionObserver to set the
 * active section in the Zustand store when ≥40% of the section is visible.
 */
export declare function useActivateScene(sectionId: SectionId): import("react").RefObject<HTMLElement>;
//# sourceMappingURL=useActivateScene.d.ts.map