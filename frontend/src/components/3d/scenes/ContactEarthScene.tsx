import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../../../store/sceneStore";
import { useSceneTransition } from "../../../hooks/useSceneTransition";

/** Generate a procedural texture via OffscreenCanvas */
function generateTexture(
  size: number,
  draw: (ctx: OffscreenCanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size, size);
  const tex = new THREE.CanvasTexture(canvas as unknown as HTMLCanvasElement);
  tex.needsUpdate = true;
  return tex;
}

/** Seeded pseudo-random for deterministic procedural textures */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function createEarthDayTexture(size: number): THREE.CanvasTexture {
  return generateTexture(size, (ctx, w, h) => {
    // Ocean base
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, w, h);

    const rand = seededRandom(42);

    // Draw land masses as white/light-gray blobs
    ctx.fillStyle = "#e0e0e0";
    const continents = [
      { x: 0.25, y: 0.35, rx: 0.08, ry: 0.15 }, // North America
      { x: 0.28, y: 0.6, rx: 0.04, ry: 0.12 }, // South America
      { x: 0.5, y: 0.3, rx: 0.06, ry: 0.1 }, // Europe
      { x: 0.52, y: 0.5, rx: 0.08, ry: 0.18 }, // Africa
      { x: 0.7, y: 0.35, rx: 0.12, ry: 0.12 }, // Asia
      { x: 0.78, y: 0.65, rx: 0.06, ry: 0.05 }, // Australia
    ];

    for (const c of continents) {
      ctx.beginPath();
      ctx.ellipse(c.x * w, c.y * h, c.rx * w, c.ry * h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add noise detail
      for (let i = 0; i < 12; i++) {
        const ox = (rand() - 0.5) * c.rx * 1.4 * w;
        const oy = (rand() - 0.5) * c.ry * 1.4 * h;
        const r = rand() * c.rx * 0.5 * w;
        ctx.beginPath();
        ctx.ellipse(
          c.x * w + ox,
          c.y * h + oy,
          r,
          r * 0.7,
          rand() * Math.PI,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }

    // Subtle grid lines (latitude/longitude)
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const y = (i / 12) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = 0; i < 24; i++) {
      const x = (i / 24) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  });
}

function createCityLightsTexture(size: number): THREE.CanvasTexture {
  return generateTexture(size, (ctx, w, h) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const rand = seededRandom(99);

    // City clusters on land masses
    const clusters = [
      { x: 0.22, y: 0.32, spread: 0.06, count: 60 }, // NA East
      { x: 0.17, y: 0.35, spread: 0.04, count: 30 }, // NA West
      { x: 0.48, y: 0.28, spread: 0.06, count: 80 }, // Europe
      { x: 0.55, y: 0.42, spread: 0.03, count: 25 }, // Middle East
      { x: 0.72, y: 0.3, spread: 0.08, count: 100 }, // East Asia
      { x: 0.65, y: 0.35, spread: 0.05, count: 50 }, // South Asia
      { x: 0.3, y: 0.55, spread: 0.03, count: 20 }, // Brazil
      { x: 0.78, y: 0.65, spread: 0.03, count: 15 }, // Australia
    ];

    for (const cl of clusters) {
      for (let i = 0; i < cl.count; i++) {
        const cx = (cl.x + (rand() - 0.5) * cl.spread) * w;
        const cy = (cl.y + (rand() - 0.5) * cl.spread) * h;
        const brightness = 0.4 + rand() * 0.6;
        const radius = 0.5 + rand() * 1.5;
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

function createBumpTexture(size: number): THREE.CanvasTexture {
  return generateTexture(size, (ctx, w, h) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, w, h);

    const rand = seededRandom(77);

    // Mountain ranges
    ctx.fillStyle = "#c0c0c0";
    const ranges = [
      { x: 0.2, y: 0.33, rx: 0.02, ry: 0.08 }, // Rockies
      { x: 0.29, y: 0.52, rx: 0.01, ry: 0.1 }, // Andes
      { x: 0.48, y: 0.27, rx: 0.02, ry: 0.03 }, // Alps
      { x: 0.68, y: 0.3, rx: 0.06, ry: 0.02 }, // Himalayas
    ];
    for (const r of ranges) {
      for (let i = 0; i < 20; i++) {
        const ox = (rand() - 0.5) * r.rx * 2 * w;
        const oy = (rand() - 0.5) * r.ry * 2 * h;
        ctx.beginPath();
        ctx.arc(r.x * w + ox, r.y * h + oy, 2 + rand() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

function createCloudTexture(size: number): THREE.CanvasTexture {
  return generateTexture(size, (ctx, w, h) => {
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.clearRect(0, 0, w, h);

    const rand = seededRandom(55);

    // Scattered cloud patches
    for (let i = 0; i < 200; i++) {
      const cx = rand() * w;
      const cy = rand() * h;
      const radius = 5 + rand() * 25;
      const alpha = 0.05 + rand() * 0.2;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(1.0, 1.0, 1.0, intensity * 0.5);
  }
`;

export function ContactEarthScene() {
  const active = useSceneStore((s) => s.activeSection === "contact");
  const groupRef = useSceneTransition(active);
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);

  const textures = useMemo(() => {
    const day = createEarthDayTexture(1024);
    const bump = createBumpTexture(512);
    const lights = createCityLightsTexture(1024);
    const clouds = createCloudTexture(512);

    // Proper wrapping
    [day, bump, lights, clouds].forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
    });

    return { day, bump, lights, clouds };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.05;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={textures.day}
          bumpMap={textures.bump}
          bumpScale={0.03}
          emissiveMap={textures.lights}
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          map={textures.clouds}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Earth-specific lighting */}
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <ambientLight intensity={0.15} />
    </group>
  );
}
