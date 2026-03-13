import React from "react";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Postprocessing stack: Bloom + Noise + Vignette.
 * multisampling={0} + disableNormalPass required for transparent canvas.
 * Wrapped in ErrorBoundary so a GPU failure doesn't crash the entire canvas.
 */
class EffectsBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function PostEffects() {
  return (
    <EffectComposer
      multisampling={0}
      enableNormalPass={false}
      renderPriority={1}
    >
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.8}
        mipmapBlur
      />
      <Noise opacity={0.035} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export function Effects() {
  return (
    <EffectsBoundary>
      <PostEffects />
    </EffectsBoundary>
  );
}
