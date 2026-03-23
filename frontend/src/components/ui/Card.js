import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
export function Card({ variant, hover, className, children, ...props }) {
    const v = variant ?? hover ?? "default";
    const tiltRef = useRef(null);
    const handleMouse = (e) => {
        if (v !== "tilt" || !tiltRef.current)
            return;
        const rect = tiltRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltRef.current.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    };
    const handleLeave = () => {
        if (v !== "tilt" || !tiltRef.current)
            return;
        tiltRef.current.style.transform = "";
    };
    if (v === "lift") {
        return (_jsx(motion.div, { className: cn("bg-surface border border-border rounded-lg overflow-hidden", className), whileHover: {
                scale: 1.01,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
            }, transition: { type: "spring", stiffness: 300, damping: 20 }, ...props, children: children }));
    }
    if (v === "scale") {
        return (_jsx(motion.div, { className: cn("bg-surface border border-border rounded-lg overflow-hidden", className), whileHover: { scale: 1.03 }, transition: { type: "spring", stiffness: 300, damping: 20 }, ...props, children: children }));
    }
    return (_jsx("div", { ref: tiltRef, className: cn("bg-surface border border-border rounded-lg overflow-hidden", v === "tilt" && "transition-transform duration-200", className), onMouseMove: handleMouse, onMouseLeave: handleLeave, ...props, children: children }));
}
//# sourceMappingURL=Card.js.map