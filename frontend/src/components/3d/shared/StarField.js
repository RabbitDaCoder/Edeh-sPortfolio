import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
/**
 * Three-layer star field for parallax depth:
 * Layer 1 — Far stars (small, slow)
 * Layer 2 — Mid stars (medium, moderate)
 * Layer 3 — Near stars (larger, fastest, twinkle)
 */
export const StarField = memo(function StarField() {
    const farRef = useRef(null);
    const midRef = useRef(null);
    const nearRef = useRef(null);
    const { farCount, midCount, nearCount } = useMemo(() => {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const isLowEnd = typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
        const reduce = isMobile || isLowEnd;
        return {
            farCount: reduce ? 800 : 3000,
            midCount: reduce ? 200 : 800,
            nearCount: reduce ? 60 : 200,
        };
    }, []);
    const farPositions = useMemo(() => random.inSphere(new Float32Array(farCount * 3), {
        radius: 80,
    }), [farCount]);
    const midPositions = useMemo(() => random.inSphere(new Float32Array(midCount * 3), {
        radius: 40,
    }), [midCount]);
    const nearPositions = useMemo(() => random.inSphere(new Float32Array(nearCount * 3), {
        radius: 20,
    }), [nearCount]);
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
            const mat = nearRef.current.material;
            mat.size = 0.25 + 0.1 * Math.sin(t * 2);
        }
    });
    return (_jsxs(_Fragment, { children: [_jsx(Points, { ref: farRef, positions: farPositions, stride: 3, frustumCulled: false, children: _jsx(PointMaterial, { transparent: true, color: "#ffffff", size: 0.08, sizeAttenuation: true, depthWrite: false, opacity: 0.5 }) }), _jsx(Points, { ref: midRef, positions: midPositions, stride: 3, frustumCulled: false, children: _jsx(PointMaterial, { transparent: true, color: "#ffffff", size: 0.18, sizeAttenuation: true, depthWrite: false, opacity: 0.7 }) }), _jsx(Points, { ref: nearRef, positions: nearPositions, stride: 3, frustumCulled: false, children: _jsx(PointMaterial, { transparent: true, color: "#ffffff", size: 0.35, sizeAttenuation: true, depthWrite: false, opacity: 0.9 }) })] }));
});
//# sourceMappingURL=StarField.js.map