import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
import * as THREE from "three";

/**
 * Three-layer star field for parallax depth:
 * Layer 1 — Far stars (small, slow)
 * Layer 2 — Mid stars (medium, moderate)
 * Layer 3 — Near stars (larger, fastest, twinkle)
 */
export function StarField() {
  const farRef = useRef<THREE.Points>(null);
  const midRef = useRef<THREE.Points>(null);
  const nearRef = useRef<THREE.Points>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isLowEnd =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
  const reduce = isMobile || isLowEnd;

  const farCount = reduce ? 800 : 3000;
  const midCount = reduce ? 200 : 800;
  const nearCount = reduce ? 60 : 200;

  const farPositions = useMemo(
    () =>
      random.inSphere(new Float32Array(farCount * 3), {
        radius: 80,
      }) as Float32Array,
    [farCount],
  );

  const midPositions = useMemo(
    () =>
      random.inSphere(new Float32Array(midCount * 3), {
        radius: 40,
      }) as Float32Array,
    [midCount],
  );

  const nearPositions = useMemo(
    () =>
      random.inSphere(new Float32Array(nearCount * 3), {
        radius: 20,
      }) as Float32Array,
    [nearCount],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Far stars — slowest rotation
    if (farRef.current) {
      farRef.current.rotation.y = t * 0.02;
    }

    // Mid stars — moderate rotation
    if (midRef.current) {
      midRef.current.rotation.y = t * 0.04;
    }

    // Near stars — fastest rotation + twinkle
    if (nearRef.current) {
      nearRef.current.rotation.y = t * 0.08;
      const mat = nearRef.current.material as THREE.PointsMaterial;
      mat.size = 0.25 + 0.1 * Math.sin(t * 2);
    }
  });

  return (
    <>
      {/* Layer 1 — Far stars */}
      <Points
        ref={farRef}
        positions={farPositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.08}
          sizeAttenuation
          depthWrite={false}
          opacity={0.5}
        />
      </Points>

      {/* Layer 2 — Mid stars */}
      <Points
        ref={midRef}
        positions={midPositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.18}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>

      {/* Layer 3 — Near stars (twinkle) */}
      <Points
        ref={nearRef}
        positions={nearPositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.35}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
    </>
  );
}
