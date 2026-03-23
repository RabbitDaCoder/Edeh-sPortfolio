import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { motion } from "framer-motion";
export const PolaroidCard = React.memo(function PolaroidCard({ polaroid, index, }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20, rotate: polaroid.rotation }, animate: { opacity: 1, y: 0, rotate: polaroid.rotation }, transition: {
            duration: 0.5,
            delay: 0.1 + index * 0.05,
            ease: [0.25, 0.1, 0.25, 1],
        }, whileHover: {
            y: -10,
            rotate: polaroid.rotation * 0.3,
            scale: 1.04,
            zIndex: 10,
            transition: { duration: 0.22, ease: "easeOut" },
        }, style: {
            transformOrigin: "center bottom",
            cursor: "default",
            flexShrink: 0,
        }, children: _jsxs("div", { style: {
                backgroundColor: "#F5F5F0",
                width: "clamp(120px, 40vw, 160px)",
                padding: "8px 8px 36px 8px",
                borderRadius: "2px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
            }, children: [_jsx("div", { style: {
                        width: "100%",
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                        backgroundColor: "#1A1A1A",
                        position: "relative",
                        flexShrink: 0,
                    }, children: polaroid.src ? (_jsx("img", { src: polaroid.src, alt: polaroid.alt, loading: "lazy", decoding: "async", style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: "grayscale(100%) contrast(1.05)",
                            transition: "filter 0.3s ease",
                        }, onMouseEnter: (e) => {
                            e.target.style.filter =
                                "grayscale(0%) contrast(1.0)";
                        }, onMouseLeave: (e) => {
                            e.target.style.filter =
                                "grayscale(100%) contrast(1.05)";
                        } })) : (_jsx("div", { style: {
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }, children: _jsxs("svg", { viewBox: "0 0 24 24", width: "28", height: "28", fill: "none", stroke: "#555", strokeWidth: "1.5", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), _jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }), _jsx("polyline", { points: "21 15 16 10 5 21" })] }) })) }), _jsx("p", { style: {
                        fontFamily: '"Caveat", cursive',
                        fontSize: "clamp(11px, 2.5vw, 13px)",
                        color: "#2C2C2C",
                        textAlign: "center",
                        marginTop: "6px",
                        marginBottom: 0,
                        lineHeight: 1.2,
                    }, children: polaroid.caption })] }) }));
});
//# sourceMappingURL=PolaroidCard.js.map