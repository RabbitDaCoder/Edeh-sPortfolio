import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
export const PageWrapper = ({ title, description, children, className, }) => {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: title }), description && _jsx("meta", { name: "description", content: description }), _jsx("meta", { property: "og:title", content: title }), description && (_jsx("meta", { property: "og:description", content: description }))] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: { duration: 0.4 }, className: className, children: children })] }));
};
//# sourceMappingURL=PageWrapper.js.map