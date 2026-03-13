import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

/**
 * Smoothly lerps opacity & scale for a scene group based on whether it is active.
 * Returns a ref to attach to the <group>.
 */
export function useSceneTransition(active: boolean) {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef({ opacity: 0, scale: 0 });

  target.current.opacity = active ? 1 : 0;
  target.current.scale = active ? 1 : 0.85;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const speed = 3 * Math.min(delta, 0.05);
    g.visible = g.scale.x > 0.01;

    const nextScale = MathUtils.lerp(g.scale.x, target.current.scale, speed);
    g.scale.setScalar(nextScale);

    // Traverse meshes to lerp material opacity
    g.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        if (mat && "opacity" in mat) {
          mat.transparent = true;
          mat.opacity = MathUtils.lerp(
            mat.opacity,
            target.current.opacity,
            speed,
          );
        }
      }
    });
  });

  return groupRef;
}
