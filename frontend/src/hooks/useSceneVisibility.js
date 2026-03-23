import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSceneStore } from "../store/sceneStore";
/**
 * Returns a groupRef to attach to the scene's root <group>.
 * Automatically fades in/out based on whether this scene's
 * section is active. Uses GSAP for smooth transitions.
 */
export function useSceneVisibility(sectionId) {
    const groupRef = useRef(null);
    const activeSection = useSceneStore((s) => s.activeSection);
    const isActive = activeSection === sectionId;
    useEffect(() => {
        const group = groupRef.current;
        if (!group)
            return;
        const targetOpacity = isActive ? 1 : 0;
        const targetScale = isActive ? 1 : 0;
        // Store opacity in userData for traversal
        if (group.userData.opacity === undefined) {
            group.userData.opacity = isActive ? 1 : 0;
        }
        const tween = gsap.to(group.userData, {
            opacity: targetOpacity,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: () => {
                const currentOpacity = group.userData.opacity;
                group.visible = currentOpacity > 0.01;
                group.traverse((child) => {
                    if (child.isMesh ||
                        child.isLineSegments) {
                        const mat = child.material;
                        if (mat && "opacity" in mat) {
                            mat.opacity = currentOpacity;
                            mat.transparent = true;
                        }
                    }
                });
            },
        });
        gsap.to(group.scale, {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: true,
        });
        return () => {
            tween.kill();
        };
    }, [isActive]);
    return { groupRef, isActive };
}
//# sourceMappingURL=useSceneVisibility.js.map