import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * Blog scene: 400 drifting particles + 1500-particle spiral galaxy.
 * Represents the flow of ideas and writing.
 */

const DRIFT_COUNT = 400;
const SPIRAL_COUNT = 1500;

export function BlogScene() {
  const { groupRef, isActive } = useSceneVisibility("blog");
  const driftRef = useRef<THREE.InstancedMesh>(null!);
  const spiralRef = useRef<THREE.InstancedMesh>(null!);

  const driftSeeds = useMemo(() => {
    const arr = new Float32Array(DRIFT_COUNT * 4); // x, y, z, speed
    for (let i = 0; i < DRIFT_COUNT; i++) {
      arr[i * 4] = (Math.random() - 0.5) * 15;
      arr[i * 4 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 4 + 2] = (Math.random() - 0.5) * 15;
      arr[i * 4 + 3] = 0.2 + Math.random() * 0.5;
    }
    return arr;
  }, []);

  const spiralSeeds = useMemo(() => {
    const arr = new Float32Array(SPIRAL_COUNT * 2); // angle, arm offset
    for (let i = 0; i < SPIRAL_COUNT; i++) {
      arr[i * 2] = (i / SPIRAL_COUNT) * Math.PI * 6; // 3 full turns
      arr[i * 2 + 1] = (Math.random() - 0.5) * 0.6; // arm thickness
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    const t = clock.getElapsedTime();

    // Drifting particles
    if (driftRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < DRIFT_COUNT; i++) {
        const speed = driftSeeds[i * 4 + 3];
        dummy.position.set(
          driftSeeds[i * 4] + Math.sin(t * speed + i) * 0.3,
          driftSeeds[i * 4 + 1] + Math.cos(t * speed * 0.5 + i * 0.7) * 0.2,
          driftSeeds[i * 4 + 2],
        );
        dummy.scale.setScalar(0.015 + 0.01 * Math.sin(t + i * 0.3));
        dummy.updateMatrix();
        driftRef.current.setMatrixAt(i, dummy.matrix);
      }
      driftRef.current.instanceMatrix.needsUpdate = true;
    }

    // Spiral galaxy
    if (spiralRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < SPIRAL_COUNT; i++) {
        const angle = spiralSeeds[i * 2] + t * 0.05;
        const arm = spiralSeeds[i * 2 + 1];
        const r = (i / SPIRAL_COUNT) * 5 + 0.5;
        dummy.position.set(
          Math.cos(angle) * r + arm * Math.cos(angle),
          arm * 0.3,
          Math.sin(angle) * r + arm * Math.sin(angle),
        );
        dummy.scale.setScalar(0.012);
        dummy.updateMatrix();
        spiralRef.current.setMatrixAt(i, dummy.matrix);
      }
      spiralRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Drifting idea particles */}
      <instancedMesh
        ref={driftRef}
        args={[undefined, undefined, DRIFT_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </instancedMesh>

      {/* Spiral galaxy */}
      <instancedMesh
        ref={spiralRef}
        args={[undefined, undefined, SPIRAL_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
      </instancedMesh>
    </group>
  );
}
