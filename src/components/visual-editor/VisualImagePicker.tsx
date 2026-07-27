"use client";

import { useState, useRef, useCallback } from "react";
import { ImagePlus, Upload, Trash2, Loader2 } from "lucide-react";
import { uploadMedia } from "@/lib/media/actions";
import { VisualMediaPickerDialog } from "./VisualMediaPickerDialog";

interface VisualImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function VisualImagePicker({ value, onChange }: VisualImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setPreviewError(false);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      try {
        const formData = new FormData();
        formData.set("file", file);

        const result = await uploadMedia(formData);

        if (result.success && result.url) {
          onChange(result.url);
        } else if (result.error) {
          console.error("[Upload] Error:", result.error);
        }
      } catch (err) {
        console.error("[Upload] Exception:", err);
      } finally {
        clearTimeout(timeout);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setPreviewError(false);
  }, [onChange]);

  const handleMediaSelect = useCallback(
    (url: string) => {
      onChange(url);
      setShowMediaPicker(false);
    },
    [onChange]
  );

  const hasImage = Boolean(value) && !previewError;

  return (
    <div className="space-y-2">
      {uploading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Subiendo imagen...
          </div>
        </div>
      ) : hasImage ? (
        <div className="group relative overflow-hidden rounded-lg border bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-32 w-full object-cover"
            onError={() => setPreviewError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 transition-colors group-hover:bg-black/40">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md bg-white/90 p-2 text-xs font-medium text-foreground opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
              title="Reemplazar imagen"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md bg-red-500/90 p-2 text-xs font-medium text-white opacity-0 shadow transition-all hover:bg-red-500 group-hover:opacity-100"
              title="Eliminar imagen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/10 px-4 py-6">
          <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Sin imagen</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              <Upload className="h-3 w-3" />
              Subir imagen
            </button>
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80"
            >
              <ImagePlus className="h-3 w-3" />
              Biblioteca
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {showMediaPicker && (
        <VisualMediaPickerDialog
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
}
