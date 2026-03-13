import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3 orbiting point lights (white only) providing subtle dynamic lighting.
 */
export function CosmicLights() {
  const l1 = useRef<THREE.PointLight>(null!);
  const l2 = useRef<THREE.PointLight>(null!);
  const l3 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    l1.current.position.set(
      Math.sin(t * 0.3) * 8,
      Math.cos(t * 0.2) * 5,
      Math.sin(t * 0.15) * 8,
    );
    l2.current.position.set(
      Math.cos(t * 0.25) * 10,
      Math.sin(t * 0.35) * 4,
      Math.cos(t * 0.2) * 6,
    );
    l3.current.position.set(
      Math.sin(t * 0.4) * 6,
      Math.cos(t * 0.3) * 8,
      -Math.sin(t * 0.25) * 10,
    );
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={l1} color="#ffffff" intensity={1.2} distance={20} />
      <pointLight ref={l2} color="#cccccc" intensity={0.8} distance={18} />
      <pointLight ref={l3} color="#dddddd" intensity={1.0} distance={22} />
    </>
  );
}
