"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface UploadDropzoneProps {
  onDrop: (files: FileList) => void;
}

export function UploadDropzone({ onDrop }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onDrop(e.dataTransfer.files);
      }
    },
    [onDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onDrop(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
        aria-hidden="true"
      />
      <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Imágenes, videos y documentos. Máx. 20 MB.
      </p>
    </div>
  );
}
