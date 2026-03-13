import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * About scene: DNA-style double helix of ~150 connected spheres
 * rotating slowly, representing the interconnected layers of the developer.
 */
export function AboutScene() {
  const { groupRef, isActive } = useSceneVisibility("about");
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const COUNT = 150;

  const seeds = useMemo(() => {
    const arr: { strand: number; index: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push({ strand: i < COUNT / 2 ? 0 : 1, index: i % (COUNT / 2) });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const half = COUNT / 2;

    for (let i = 0; i < COUNT; i++) {
      const { strand, index } = seeds[i];
      const yPos = (index / half) * 8 - 4;
      const angle = (index / half) * Math.PI * 4 + t * 0.3;
      const offset = strand === 0 ? 0 : Math.PI;
      const x = Math.cos(angle + offset) * 1.8;
      const z = Math.sin(angle + offset) * 1.8;

      dummy.position.set(x, yPos, z);
      const s = 0.06 + 0.02 * Math.sin(t + index * 0.3);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.5} metalness={0.3} />
      </instancedMesh>
    </group>
  );
}
