import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneVisibility } from "../../../hooks/useSceneVisibility";

gsap.registerPlugin(ScrollTrigger);

interface FragmentData {
  centroid: THREE.Vector3;
  direction: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  speed: number;
}

/**
 * Hero scene: fragmented geometric sphere that dissolves on scroll,
 * wireframe edges overlay, 40 floating fragments, mouse tilt, hero-specific lighting.
 */
export function HeroScene() {
  const { groupRef, isActive } = useSceneVisibility("hero");
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(window.innerWidth > 500);
  }, []);

  if (!show) return null;
  const meshRef = useRef<THREE.Mesh>(null!);
  const edgesRef = useRef<THREE.LineSegments>(null!);
  const fragmentsRef = useRef<THREE.InstancedMesh>(null!);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const FRAGMENT_COUNT = 40;

  // Create non-indexed geometry for per-face explosion
  const { faceGeo, edgesGeo, fragmentData, faceCount, baseCentroids } =
    useMemo(() => {
      const ico = new THREE.IcosahedronGeometry(2.4, 4);
      const nonIndexed = ico.toNonIndexed();
      const positions = nonIndexed.attributes.position;
      const count = positions.count / 3; // number of triangular faces

      // Compute centroid + explosion direction per face
      const centroids: THREE.Vector3[] = [];
      const directions: THREE.Vector3[] = [];
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const cx =
          (positions.getX(i3) +
            positions.getX(i3 + 1) +
            positions.getX(i3 + 2)) /
          3;
        const cy =
          (positions.getY(i3) +
            positions.getY(i3 + 1) +
            positions.getY(i3 + 2)) /
          3;
        const cz =
          (positions.getZ(i3) +
            positions.getZ(i3 + 1) +
            positions.getZ(i3 + 2)) /
          3;
        const centroid = new THREE.Vector3(cx, cy, cz);
        centroids.push(centroid);
        directions.push(centroid.clone().normalize());
      }

      // Store base centroids as Float32Array for face displacement
      const baseCents = new Float32Array(count * 3);
      centroids.forEach((c, i) => {
        baseCents[i * 3] = c.x;
        baseCents[i * 3 + 1] = c.y;
        baseCents[i * 3 + 2] = c.z;
      });

      // EdgesGeometry from original ico for wireframe overlay
      const edges = new THREE.EdgesGeometry(ico, 15);

      // Floating fragment data
      const fragments: FragmentData[] = [];
      for (let i = 0; i < 40; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3.5 + Math.random() * 2;
        fragments.push({
          centroid: new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
          ),
          direction: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize(),
          rotationAxis: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize(),
          speed: 0.3 + Math.random() * 0.7,
        });
      }

      return {
        faceGeo: nonIndexed,
        edgesGeo: edges,
        fragmentData: fragments,
        faceCount: count,
        baseCentroids: baseCents,
      };
    }, []);

  // Store base vertex positions for explosion
  const basePositions = useMemo(() => {
    return new Float32Array(faceGeo.attributes.position.array);
  }, [faceGeo]);

  // GSAP scroll-driven dissolve
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Mouse tracking for tilt
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    const t = clock.getElapsedTime();
    const progress = progressRef.current;

    // Explode faces outward based on scroll progress
    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;

      for (let face = 0; face < faceCount; face++) {
        const dx = baseCentroids[face * 3];
        const dy = baseCentroids[face * 3 + 1];
        const dz = baseCentroids[face * 3 + 2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const nx = dx / len;
        const ny = dy / len;
        const nz = dz / len;

        // Each face explodes outward with staggered timing
        const stagger = (face / faceCount) * 0.3;
        const faceProgress = Math.max(
          0,
          Math.min(1, (progress - stagger) / 0.7),
        );
        const explodeDist = faceProgress * 6;

        for (let v = 0; v < 3; v++) {
          const idx = (face * 3 + v) * 3;
          arr[idx] = basePositions[idx] + nx * explodeDist;
          arr[idx + 1] = basePositions[idx + 1] + ny * explodeDist;
          arr[idx + 2] = basePositions[idx + 2] + nz * explodeDist;
        }
      }
      pos.needsUpdate = true;

      // Fade material as it explodes
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 1 - progress * 0.8;

      // Slow rotation
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.x = t * 0.06;
    }

    // Match wireframe edges rotation
    if (edgesRef.current && meshRef.current) {
      edgesRef.current.rotation.copy(meshRef.current.rotation);
      const edgeMat = edgesRef.current.material as THREE.LineBasicMaterial;
      edgeMat.opacity = Math.max(0, 0.25 - progress * 0.3);
    }

    // Floating fragments orbit
    if (fragmentsRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < FRAGMENT_COUNT; i++) {
        const f = fragmentData[i];
        const orbitAngle = t * f.speed * 0.3;
        const px =
          f.centroid.x * Math.cos(orbitAngle) -
          f.centroid.z * Math.sin(orbitAngle);
        const pz =
          f.centroid.x * Math.sin(orbitAngle) +
          f.centroid.z * Math.cos(orbitAngle);
        dummy.position.set(px, f.centroid.y + Math.sin(t * f.speed) * 0.3, pz);
        dummy.scale.setScalar(0.04 + Math.sin(t + i) * 0.01);
        dummy.rotation.set(
          t * f.speed * 0.5,
          t * f.speed * 0.3,
          t * f.speed * 0.4,
        );
        dummy.updateMatrix();
        fragmentsRef.current.setMatrixAt(i, dummy.matrix);
      }
      fragmentsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Mouse tilt on the whole group
    if (groupRef.current) {
      groupRef.current.rotation.x +=
        (mouseRef.current.y * 0.15 - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.y +=
        (mouseRef.current.x * 0.15 - groupRef.current.rotation.y) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Fragmented sphere */}
      <mesh ref={meshRef} geometry={faceGeo}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.7}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe edge overlay */}
      <lineSegments ref={edgesRef} geometry={edgesGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </lineSegments>

      {/* Floating fragments */}
      <instancedMesh
        ref={fragmentsRef}
        args={[undefined, undefined, FRAGMENT_COUNT]}
        frustumCulled={false}
      >
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#cccccc"
          roughness={0.6}
          metalness={0.4}
          transparent
          opacity={0.6}
        />
      </instancedMesh>

      {/* Hero-specific lighting */}
      <pointLight position={[4, 4, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#cccccc" />
    </group>
  );
}
