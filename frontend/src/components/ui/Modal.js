import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, children, className, }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    return (_jsx(AnimatePresence, { mode: "wait", children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, onClick: onClose, className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, transition: { duration: 0.3 }, onClick: (e) => e.stopPropagation(), className: `fixed inset-0 z-50 m-auto max-w-md w-[90%] max-h-[90vh] bg-background border border-border rounded-sm shadow-lg overflow-y-auto ${className || ''}`, children: _jsxs("div", { className: "p-6", children: [title && (_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-display-sm font-semibold text-text-primary", children: title }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, "aria-label": "Close modal", children: _jsx(X, { className: "w-4 h-4" }) })] })), children] }) })] })) }));
};
//# sourceMappingURL=Modal.js.map