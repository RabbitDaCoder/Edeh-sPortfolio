import React from "react";
import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  height = 400,
}) => {
  return (
    <div data-color-mode="dark">
      {/* @ts-expect-error — MDEditor types expect a newer @types/react that includes bigint in ReactNode */}
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={height}
        preview="live"
      />
    </div>
  );
};
