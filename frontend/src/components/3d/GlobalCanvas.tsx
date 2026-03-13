import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useSceneStore } from "../../store/sceneStore";
import { StarField } from "./shared/StarField";
import { NebulaCloud } from "./shared/NebulaCloud";
import { Effects } from "./postprocessing/Effects";
import { HeroScene } from "./scenes/HeroScene";
import { AboutScene } from "./scenes/AboutScene";
import { SkillsScene } from "./scenes/SkillsScene";
import { WorkScene } from "./scenes/WorkScene";
import { CareerScene } from "./scenes/CareerScene";
import { BlogScene } from "./scenes/BlogScene";
import { BooksScene } from "./scenes/BooksScene";

/** Subtle mouse parallax on the entire scene */
function MouseParallax() {
  const { scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(() => {
    scene.rotation.x += (mouse.current.y * 0.02 - scene.rotation.x) * 0.03;
    scene.rotation.y += (mouse.current.x * 0.02 - scene.rotation.y) * 0.03;
  });

  return null;
}

/** Mark the 3D layer as loaded once the Canvas is ready */
function LoadNotifier() {
  const setIsLoaded = useSceneStore((s) => s.setIsLoaded);
  useEffect(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);
  return null;
}

export function GlobalCanvas() {
  const [visible, setVisible] = useState(true);

  // Hide canvas on low-end devices that can't keep up
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency <= 2
    ) {
      setVisible(false);
    }
  }, []);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1 : 2;
    return Math.min(maxDpr, window.devicePixelRatio);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <LoadNotifier />
          <MouseParallax />

          {/* Shared ambient environment */}
          <ambientLight intensity={0.15} />

          {/* Always-on background layers */}
          <StarField />
          <NebulaCloud />

          {/* Section scenes — visibility controlled internally */}
          <HeroScene />
          <AboutScene />
          <SkillsScene />
          <WorkScene />
          <CareerScene />
          <BlogScene />
          <BooksScene />

          {/* Postprocessing — MUST come last */}
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
}
