import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../utils/cn';
export const Textarea = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (_jsxs("div", { className: "flex flex-col gap-2", children: [label && (_jsx("label", { className: "text-body-sm font-medium text-text-primary", children: label })), _jsx("textarea", { ref: ref, className: cn('w-full px-4 py-2 text-body-md font-sans', 'border border-border rounded-sm', 'bg-background text-text-primary placeholder-text-muted', 'transition-smooth resize-none', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', error && 'border-red-500', className), ...props }), error && _jsx("p", { className: "text-body-sm text-red-500", children: error })] }));
});
Textarea.displayName = 'Textarea';
//# sourceMappingURL=Textarea.js.map