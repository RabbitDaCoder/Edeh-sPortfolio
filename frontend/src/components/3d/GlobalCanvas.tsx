import React, { Suspense, useEffect, useMemo, useState, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { StarField } from "./shared/StarField";

export const GlobalCanvas = memo(function GlobalCanvas() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setVisible(false);
      return;
    }
    if (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency <= 2
    ) {
      setVisible(false);
      return;
    }
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setVisible(false);
    } catch {
      setVisible(false);
    }
  }, []);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(1.5, window.devicePixelRatio);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
        frameloop="always"
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
          <ambientLight intensity={0.15} />
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default GlobalCanvas;
