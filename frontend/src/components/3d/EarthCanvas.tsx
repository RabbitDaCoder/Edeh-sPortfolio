import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

// ── Procedural Earth textures ──────────────────────

function generateEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Ocean base — very dark
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, 2048, 1024);

  // Land masses in light grey (black and white palette)
  ctx.fillStyle = "#C8C8C8";

  // Africa — central mass
  ctx.beginPath();
  ctx.ellipse(1100, 560, 140, 200, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Europe — upper right of Africa
  ctx.beginPath();
  ctx.ellipse(1080, 360, 80, 70, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Asia — large eastern mass
  ctx.beginPath();
  ctx.ellipse(1350, 340, 260, 160, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // North America — left side
  ctx.beginPath();
  ctx.ellipse(450, 330, 160, 140, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // South America — left side below equator
  ctx.beginPath();
  ctx.ellipse(530, 620, 100, 160, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Australia — bottom right
  ctx.beginPath();
  ctx.ellipse(1580, 680, 100, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // Antarctica — bottom band
  ctx.fillStyle = "#E0E0E0";
  ctx.fillRect(0, 940, 2048, 84);

  // Add subtle noise texture over everything
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const alpha = Math.random() * 0.06;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  return new THREE.CanvasTexture(canvas);
}

function generateRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  // Ocean = dark = low roughness = reflective
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(0, 0, 512, 256);
  // Land = light = high roughness = matte
  ctx.fillStyle = "#CCCCCC";
  ctx.fillRect(200, 50, 100, 140); // Africa approx
  ctx.fillRect(270, 30, 180, 110); // Asia approx
  ctx.fillRect(80, 40, 110, 100); // Americas approx
  ctx.fillRect(320, 130, 70, 50); // Australia approx
  return new THREE.CanvasTexture(canvas);
}

function generateCityLightsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 2048, 1024);

  const cities = [
    { x: 1072, y: 598 }, // Lagos
    { x: 990, y: 330 }, // London
    { x: 490, y: 370 }, // New York
    { x: 1620, y: 360 }, // Tokyo
    { x: 1000, y: 335 }, // Paris
    { x: 1210, y: 435 }, // Dubai
    { x: 1290, y: 480 }, // Mumbai
    { x: 1650, y: 700 }, // Sydney
    { x: 1110, y: 430 }, // Cairo
    { x: 1020, y: 318 }, // Berlin
  ];

  cities.forEach(({ x, y }) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    gradient.addColorStop(0, "rgba(255,255,220,0.9)");
    gradient.addColorStop(0.4, "rgba(255,255,180,0.4)");
    gradient.addColorStop(1, "rgba(255,255,100,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

// ── Earth mesh ────────────────────────────────────

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const { earthTexture, roughnessTexture, cityLightsTexture } = useMemo(
    () => ({
      earthTexture: generateEarthTexture(),
      roughnessTexture: generateRoughnessTexture(),
      cityLightsTexture: generateCityLightsTexture(),
    }),
    [],
  );

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group rotation={[0, 0, 0.41]}>
      {/* Earth core */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughnessMap={roughnessTexture}
          roughness={0.7}
          metalness={0.1}
          bumpMap={earthTexture}
          bumpScale={0.04}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.56, 64, 64]} />
        <meshStandardMaterial
          transparent
          opacity={0.18}
          roughness={1}
          metalness={0}
          color="#FFFFFF"
          depthWrite={false}
        />
      </mesh>

      {/* City lights — additive blending on night side */}
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshBasicMaterial
          map={cityLightsTexture}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.75, 64, 64]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Self-contained Canvas ─────────────────────────

export function EarthCanvas() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
      }}
    >
      <Canvas
        shadows={false}
        frameloop="demand"
        dpr={[1, 2]}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={null}>
          {/* Sun — directional from upper left */}
          <directionalLight
            position={[-8, 4, 6]}
            intensity={2.2}
            color="#FFFFFF"
          />
          {/* Very dark ambient — most of Earth in shadow */}
          <ambientLight intensity={0.06} />

          <Earth />

          <OrbitControls
            autoRotate
            autoRotateSpeed={0.4}
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
