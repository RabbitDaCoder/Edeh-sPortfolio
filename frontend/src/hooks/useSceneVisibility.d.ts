import * as THREE from "three";
/**
 * Returns a groupRef to attach to the scene's root <group>.
 * Automatically fades in/out based on whether this scene's
 * section is active. Uses GSAP for smooth transitions.
 */
export declare function useSceneVisibility(sectionId: string): {
    groupRef: import("react").RefObject<THREE.Group<THREE.Object3DEventMap>>;
    isActive: boolean;
};
//# sourceMappingURL=useSceneVisibility.d.ts.map