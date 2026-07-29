"use client";

import { useState, useRef, useCallback } from "react";
import { ImagePlus, Upload, Trash2, Loader2 } from "lucide-react";
interface UploadResult {
  success: boolean;
  id?: string;
  error?: string;
  filename?: string;
  url?: string;
}
import { VisualMediaPickerDialog } from "./VisualMediaPickerDialog";

const MAX_CLIENT_SIZE = 4 * 1024 * 1024;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_DIM = 2560;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Error al comprimir la imagen"));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al cargar la imagen para compresión"));
    };
    img.src = url;
  });
}

interface VisualImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function VisualImagePicker({ value, onChange }: VisualImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // ════════════════════════════════════════════
      // [2] TRACE: VisualImagePicker — archivo seleccionado
      // ════════════════════════════════════════════
      console.log("[TRACE:2] VisualImagePicker — archivo seleccionado", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      });

      setUploading(true);
      setUploadError(null);
      setPreviewError(false);

      try {
        const compressed = file.size > MAX_CLIENT_SIZE ? await compressImage(file) : file;

        console.log("[TRACE:2] VisualImagePicker — compresión:", {
          original: file.size,
          final: compressed.size,
          saved: file.size - compressed.size,
        });

        const formData = new FormData();
        formData.set("file", compressed);

        // ════════════════════════════════════════════
        // [3] TRACE: FormData — campos enviados
        // ════════════════════════════════════════════
        const formDebug: Record<string, string> = {};
        formData.forEach((v, k) => {
          formDebug[k] =
            v instanceof File ? `[File] name=${v.name} size=${v.size} type=${v.type}` : String(v);
        });
        console.log("[TRACE:3] FormData — contenido:", JSON.stringify(formDebug, null, 2));

        // ════════════════════════════════════════════
        // [4] TRACE: fetch /api/media — antes de enviar
        // ════════════════════════════════════════════
        console.log("[TRACE:4] fetch /api/media — iniciando POST");
        const res = await fetch("/api/media", { method: "POST", body: formData });
        console.log("[TRACE:4] fetch /api/media — respuesta recibida", {
          status: res.status,
          statusText: res.statusText,
        });

        const result: UploadResult = await res.json();
        console.log("[TRACE:4] fetch /api/media — JSON parseado:", JSON.stringify(result, null, 2));

        if (result.success && result.url) {
          // ════════════════════════════════════════════
          // [10] TRACE: onChange — URL recibida del API
          // ════════════════════════════════════════════
          console.log("[TRACE:10] VisualImagePicker → onChange(result.url):", result.url);
          onChange(result.url);
        } else {
          console.log(
            "[TRACE:10] VisualImagePicker — upload falló, error del servidor:",
            result.error
          );
          setUploadError(result.error || "Error desconocido al subir la imagen.");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido al subir la imagen.";
        setUploadError(msg);
        console.log("[TRACE:4] fetch /api/media — EXCEPCIÓN en fetch:", msg);
        console.error("[Upload] Exception:", err);
      } finally {
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
      ) : uploadError ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-red-300 bg-red-50 px-4 py-6">
          <p className="text-xs font-medium text-red-600">{uploadError}</p>
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            <Upload className="h-3 w-3" />
            Intentar de nuevo
          </button>
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
