import React, { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Label } from "@/components/ui/label";

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function MarkdownEditor({
  label = "Content",
  value,
  onChange,
}: MarkdownEditorProps) {
  const options = useMemo(
    () => ({
      spellChecker: false,
      status: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "code",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    }),
    []
  );

  return (
    <div>
      {label && <Label>{label}</Label>}
      <SimpleMDE
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}
