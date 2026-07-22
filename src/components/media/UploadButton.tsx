"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

interface UploadButtonProps {
  onSelect: (files: FileList) => void;
  multiple?: boolean;
}

export function UploadButton({ onSelect, multiple = true }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onSelect(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Upload className="h-4 w-4" />
        Subir archivos
      </button>
    </>
  );
}
