import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../../store/sceneStore";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * Work scene: 3 project "planets" orbiting a central point.
 * Each has a unique geometry and a 60-particle ring.
 */

const PROJECTS = [
  { name: "HydroSense", orbitR: 2.5, geo: "icosahedron" as const },
  { name: "Aegis Express", orbitR: 3.5, geo: "octahedron" as const },
  { name: "VTE Faculty", orbitR: 4.5, geo: "dodecahedron" as const },
];

const RING_COUNT = 60;

export function WorkScene() {
  const { groupRef, isActive } = useSceneVisibility("work");
  const activeIdx = useSceneStore((s) => s.activeProjectIndex);

  const planet1 = useRef<THREE.Mesh>(null!);
  const planet2 = useRef<THREE.Mesh>(null!);
  const planet3 = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.InstancedMesh>(null!);

  const planetRefs = [planet1, planet2, planet3];

  const ringSeeds = useMemo(() => {
    const arr = new Float32Array(RING_COUNT * PROJECTS.length * 2);
    for (let p = 0; p < PROJECTS.length; p++) {
      for (let i = 0; i < RING_COUNT; i++) {
        const idx = p * RING_COUNT + i;
        arr[idx * 2] = (i / RING_COUNT) * Math.PI * 2;
        arr[idx * 2 + 1] = 0.3 + Math.random() * 0.2;
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    const t = clock.getElapsedTime();

    // Position each planet on its orbit
    PROJECTS.forEach((proj, pi) => {
      const ref = planetRefs[pi];
      if (!ref.current) return;
      const speed = 0.08 + pi * 0.02;
      const angle = t * speed + (pi * Math.PI * 2) / 3;
      ref.current.position.set(
        Math.cos(angle) * proj.orbitR,
        Math.sin(t * 0.2 + pi) * 0.4,
        Math.sin(angle) * proj.orbitR,
      );
      ref.current.rotation.y = t * 0.3;

      // Scale up the active project
      const targetScale = pi === activeIdx ? 1.3 : 0.8;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05,
      );
    });

    // Rings around each planet
    if (ringRef.current) {
      const dummy = new THREE.Object3D();
      for (let p = 0; p < PROJECTS.length; p++) {
        const pRef = planetRefs[p];
        if (!pRef.current) continue;
        const cx = pRef.current.position.x;
        const cy = pRef.current.position.y;
        const cz = pRef.current.position.z;
        for (let i = 0; i < RING_COUNT; i++) {
          const idx = p * RING_COUNT + i;
          const angle = ringSeeds[idx * 2] + t * 0.5;
          const r = ringSeeds[idx * 2 + 1];
          dummy.position.set(
            cx + Math.cos(angle) * r,
            cy,
            cz + Math.sin(angle) * r,
          );
          dummy.scale.setScalar(0.015);
          dummy.updateMatrix();
          ringRef.current.setMatrixAt(idx, dummy.matrix);
        }
      }
      ringRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet 1 — icosahedron */}
      <mesh ref={planet1}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Planet 2 — octahedron */}
      <mesh ref={planet2}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#dddddd" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Planet 3 — dodecahedron */}
      <mesh ref={planet3}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#bbbbbb"
          wireframe
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Orbiting ring particles */}
      <instancedMesh
        ref={ringRef}
        args={[undefined, undefined, RING_COUNT * PROJECTS.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </instancedMesh>
    </group>
  );
}
