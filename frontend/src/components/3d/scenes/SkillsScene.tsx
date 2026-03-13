import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * Skills scene: constellation map with 6 skill groups arranged in a ring.
 * Each group is a cluster of small spheres connected by line hints.
 * Hovering a skill (via Zustand) brightens its group.
 */

const SKILL_GROUPS = [
  { name: "Frontend", angle: 0 },
  { name: "Backend", angle: Math.PI / 3 },
  { name: "Animations & 3D", angle: (2 * Math.PI) / 3 },
  { name: "Tools & DevOps", angle: Math.PI },
  { name: "Databases", angle: (4 * Math.PI) / 3 },
  { name: "Design", angle: (5 * Math.PI) / 3 },
];

const NODES_PER_GROUP = 8;
const TOTAL = SKILL_GROUPS.length * NODES_PER_GROUP;

export function SkillsScene() {
  const { groupRef, isActive } = useSceneVisibility("skills");
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Pre-compute node positions around each group centre
  const positions = useMemo(() => {
    const arr = new Float32Array(TOTAL * 3);
    SKILL_GROUPS.forEach((g, gi) => {
      const cx = Math.cos(g.angle) * 3;
      const cz = Math.sin(g.angle) * 3;
      for (let n = 0; n < NODES_PER_GROUP; n++) {
        const idx = gi * NODES_PER_GROUP + n;
        const a = (n / NODES_PER_GROUP) * Math.PI * 2;
        arr[idx * 3] = cx + Math.cos(a) * (0.6 + Math.random() * 0.4);
        arr[idx * 3 + 1] = (Math.random() - 0.5) * 1;
        arr[idx * 3 + 2] = cz + Math.sin(a) * (0.6 + Math.random() * 0.4);
      }
    });
    return arr;
  }, []);

  // Lines connecting nodes within each group
  const linePositions = useMemo(() => {
    const verts: number[] = [];
    SKILL_GROUPS.forEach((_, gi) => {
      for (let n = 0; n < NODES_PER_GROUP; n++) {
        const idx = gi * NODES_PER_GROUP + n;
        const next = gi * NODES_PER_GROUP + ((n + 1) % NODES_PER_GROUP);
        verts.push(
          positions[idx * 3],
          positions[idx * 3 + 1],
          positions[idx * 3 + 2],
          positions[next * 3],
          positions[next * 3 + 1],
          positions[next * 3 + 2],
        );
      }
    });
    return new Float32Array(verts);
  }, [positions]);

  useFrame(({ clock }) => {
    if (!isActive) return;
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    for (let i = 0; i < TOTAL; i++) {
      const drift = Math.sin(t * 0.5 + i) * 0.08;
      dummy.position.set(
        positions[i * 3] + drift,
        positions[i * 3 + 1] + Math.cos(t * 0.3 + i * 0.7) * 0.06,
        positions[i * 3 + 2],
      );
      dummy.scale.setScalar(0.06 + 0.02 * Math.sin(t + i * 0.5));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, TOTAL]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#444444"
          roughness={0.4}
        />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#555555" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
