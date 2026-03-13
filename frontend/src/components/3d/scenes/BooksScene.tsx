import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * Books scene: floating monolith slabs (box geometry) arranged like
 * books on a cosmic shelf, slowly rotating and hovering.
 */

const BOOKS = 6;

export function BooksScene() {
  const { groupRef, isActive } = useSceneVisibility("books");
  const booksRef = useRef<THREE.InstancedMesh>(null!);

  const bookSeeds = useMemo(() => {
    const arr: { x: number; z: number; height: number; shade: number }[] = [];
    for (let i = 0; i < BOOKS; i++) {
      const angle = (i / BOOKS) * Math.PI * 2;
      arr.push({
        x: Math.cos(angle) * 3,
        z: Math.sin(angle) * 3,
        height: 1.0 + Math.random() * 0.8,
        shade: 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    if (!booksRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    for (let i = 0; i < BOOKS; i++) {
      const s = bookSeeds[i];
      const hover = Math.sin(t * 0.4 + i * 1.2) * 0.3;
      dummy.position.set(s.x, hover, s.z);
      dummy.rotation.set(0, t * 0.1 + i, Math.sin(t * 0.2 + i) * 0.1);
      dummy.scale.set(0.3, s.height, 0.05);
      dummy.updateMatrix();
      booksRef.current.setMatrixAt(i, dummy.matrix);
    }
    booksRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={booksRef}
        args={[undefined, undefined, BOOKS]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#dddddd" roughness={0.6} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
