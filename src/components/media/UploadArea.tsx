"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "./UploadButton";
import { UploadDropzone } from "./UploadDropzone";
import { UploadProgress } from "./UploadProgress";
import { UploadError } from "./UploadError";
import { uploadMedia, type UploadResult } from "@/lib/media/actions";

export function UploadArea() {
  const router = useRouter();
  const [uploading, setUploading] = useState<{ filename: string }[]>([]);
  const [errors, setErrors] = useState<{ message: string; filename?: string }[]>([]);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      setUploading(files.map((f) => ({ filename: f.name })));
      setErrors([]);

      const results: UploadResult[] = [];

      for (const file of files) {
        setUploading((prev) => prev.filter((u) => u.filename !== file.name));

        try {
          const formData = new FormData();
          formData.set("file", file);
          const result = await uploadMedia(formData);
          results.push(result);
        } catch {
          results.push({ success: false, error: `Error inesperado al subir "${file.name}".` });
        }
      }

      setUploading([]);

      const fileErrors = results
        .filter((r) => !r.success)
        .map((r) => ({ message: r.error || "Error desconocido" }));
      setErrors(fileErrors);

      if (results.some((r) => r.success)) {
        router.refresh();
      }
    },
    [router]
  );

  const dismissError = useCallback((index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <UploadButton onSelect={handleFiles} />
      </div>

      <UploadDropzone onDrop={handleFiles} />

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <UploadProgress key={u.filename} filename={u.filename} />
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err, i) => (
            <UploadError key={i} message={err.message} onDismiss={() => dismissError(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
