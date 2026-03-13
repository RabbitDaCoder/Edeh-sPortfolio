import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../../store/sceneStore";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

/**
 * Career scene: vertical journey path with 5 milestone nodes connected by
 * a tube, plus warp-starfield streaks in the background.
 */

const MILESTONES = 5;
const WARP_COUNT = 400;

export function CareerScene() {
  const { groupRef, isActive } = useSceneVisibility("career");
  const activeNode = useSceneStore((s) => s.activeCareerNode);
  const nodesRef = useRef<THREE.InstancedMesh>(null!);
  const warpRef = useRef<THREE.InstancedMesh>(null!);

  // Milestone positions along a vertical path
  const milestonePositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < MILESTONES; i++) {
      const y = (i / (MILESTONES - 1)) * 7 - 3.5;
      const x = Math.sin(i * 1.2) * 1.5;
      arr.push(new THREE.Vector3(x, y, 0));
    }
    return arr;
  }, []);

  // Tube path through milestones
  const tubeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(milestonePositions);
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  }, [milestonePositions]);

  // Warp star seeds
  const warpSeeds = useMemo(() => {
    const arr = new Float32Array(WARP_COUNT * 4); // x, y, z, speed
    for (let i = 0; i < WARP_COUNT; i++) {
      arr[i * 4] = (Math.random() - 0.5) * 12;
      arr[i * 4 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 4 + 2] = (Math.random() - 0.5) * 12;
      arr[i * 4 + 3] = 0.3 + Math.random() * 0.7;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    const t = clock.getElapsedTime();

    // Milestone nodes
    if (nodesRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < MILESTONES; i++) {
        const p = milestonePositions[i];
        dummy.position.copy(p);
        const isActive = i === activeNode;
        const s = isActive ? 0.18 + 0.04 * Math.sin(t * 3) : 0.1;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Warp streaks — vertical motion
    if (warpRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < WARP_COUNT; i++) {
        let y = warpSeeds[i * 4 + 1] + t * warpSeeds[i * 4 + 3];
        y = (((y % 12) + 12) % 12) - 6; // wrap around
        dummy.position.set(warpSeeds[i * 4], y, warpSeeds[i * 4 + 2]);
        dummy.scale.set(0.005, 0.15 * warpSeeds[i * 4 + 3], 0.005);
        dummy.updateMatrix();
        warpRef.current.setMatrixAt(i, dummy.matrix);
      }
      warpRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Journey tube */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial color="#888888" transparent opacity={0.6} />
      </mesh>

      {/* Milestone nodes */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, MILESTONES]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#666666"
          roughness={0.3}
        />
      </instancedMesh>

      {/* Warp streaks */}
      <instancedMesh
        ref={warpRef}
        args={[undefined, undefined, WARP_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </instancedMesh>
    </group>
  );
}
