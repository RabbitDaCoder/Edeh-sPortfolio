import { jsx as _jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
export function JsonLD({ schema }) {
    return (_jsx(Helmet, { children: _jsx("script", { type: "application/ld+json", children: JSON.stringify(schema) }) }));
}
//# sourceMappingURL=JsonLD.js.map