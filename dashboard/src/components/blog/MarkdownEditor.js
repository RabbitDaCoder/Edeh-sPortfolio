import { jsx as _jsx } from "react/jsx-runtime";
import MDEditor from "@uiw/react-md-editor";
export const MarkdownEditor = ({ value, onChange, height = 400, }) => {
    return (_jsx("div", { "data-color-mode": "dark", children: _jsx(MDEditor, { value: value, onChange: (val) => onChange(val ?? ""), height: height, preview: "live" }) }));
};
//# sourceMappingURL=MarkdownEditor.js.map