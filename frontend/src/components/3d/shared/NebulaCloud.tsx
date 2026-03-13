import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

/**
 * Soft particles forming a drifting nebula cloud.
 * Purely B&W — uses simplex noise for organic motion.
 * AdditiveBlending gives cosmic atmospheric glow and depth.
 */
export function NebulaCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isLowEnd =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
  const COUNT = isMobile || isLowEnd ? 200 : 800;

  const seeds = useMemo(() => {
    const arr = new Float32Array(COUNT * 4); // x, y, z, phase
    for (let i = 0; i < COUNT; i++) {
      arr[i * 4] = (Math.random() - 0.5) * 25;
      arr[i * 4 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 4 + 2] = (Math.random() - 0.5) * 25;
      arr[i * 4 + 3] = Math.random() * Math.PI * 2;
    }
    return arr;
  }, [COUNT]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.15;

    for (let i = 0; i < COUNT; i++) {
      const sx = seeds[i * 4];
      const sy = seeds[i * 4 + 1];
      const sz = seeds[i * 4 + 2];
      const phase = seeds[i * 4 + 3];

      const nx = noise3D(sx * 0.03, sy * 0.03, t + phase) * 2;
      const ny = noise3D(sy * 0.03, sz * 0.03, t + phase) * 2;
      const nz = noise3D(sz * 0.03, sx * 0.03, t + phase) * 2;

      dummy.position.set(sx + nx, sy + ny, sz + nz);
      // Remap noise to 0.5–2.0 for size variation
      const noiseVal = noise3D(sx * 0.05, sy * 0.05, t * 0.5 + phase);
      const s = 0.5 + (noiseVal + 1) * 0.75; // maps -1..1 to 0.5..2.0
      dummy.scale.setScalar(s * 0.08);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#888888"
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
