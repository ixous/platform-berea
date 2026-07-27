"use client";

import { X, Save } from "lucide-react";
import { useVisualEditor, type BlockConfig } from "./VisualEditorContext";
import { VisualImagePicker } from "./VisualImagePicker";

export function VisualEditorPanel({ blocks }: { blocks: BlockConfig[] }) {
  const { selectedBlock, selectBlock, updateField, saveBlock, getBlockValues, saving } =
    useVisualEditor();

  if (!selectedBlock) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Selecciona un bloque en la vista previa para editarlo.
        </p>
      </div>
    );
  }

  const config = blocks.find((b) => b.key === selectedBlock);
  if (!config) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">Bloque no encontrado.</p>
      </div>
    );
  }

  const values = getBlockValues(selectedBlock);

  const handleSave = () => {
    saveBlock(selectedBlock);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{config.label}</h3>
        <button
          onClick={() => selectBlock(null)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {config.fields.map((field) => {
            if (field.type === "image") {
              return (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-sm font-medium">{field.label}</label>
                  <VisualImagePicker
                    value={values[field.name]}
                    onChange={(val) => updateField(selectedBlock, field.name, val)}
                  />
                </div>
              );
            }

            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={values[field.name]}
                    onChange={(e) => updateField(selectedBlock, field.name, e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.name]}
                    onChange={(e) => updateField(selectedBlock, field.name, e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t p-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
