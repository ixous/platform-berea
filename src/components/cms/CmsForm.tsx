"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createEntity,
  updateEntity,
  deleteEntity,
  restoreEntity,
  changeEntityStatus,
} from "@/lib/cms/actions";
import type { EntityDef } from "@/lib/cms/config";
import { CmsStatusBadge } from "./CmsStatusBadge";
import { Loader2, Save, Trash2, Undo2 } from "lucide-react";

interface CmsFormProps {
  entityType: string;
  config: EntityDef;
  initialData?: Record<string, unknown>;
  isEditing: boolean;
}

function fieldToInputName(field: string): string {
  return field.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function formatInitialValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) {
    if (type === "date") return value.toISOString().split("T")[0];
    if (type === "datetime") return value.toISOString().slice(0, 16);
    return value.toISOString();
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function CmsForm({ entityType, config, initialData, isEditing }: CmsFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>(
    initialData && config.statusField ? String(initialData[config.statusField] ?? "draft") : "draft"
  );

  const [, formAction, pending] = useActionState(async (_prev: unknown, formData: FormData) => {
    const data: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.hidden) continue;
      const formValue = formData.get(fieldToInputName(field.name));
      if (formValue !== null && String(formValue) !== "") {
        data[field.name] = String(formValue);
      }
    }
    try {
      const result = await (isEditing
        ? updateEntity(entityType, (initialData?.id as string) || "", data)
        : createEntity(entityType, data));
      if (result.success) {
        setMessage({
          type: "success",
          text: isEditing ? "Actualizado correctamente." : "Creado correctamente.",
        });
        if (!isEditing && result.id) {
          router.push(`/admin/content/${entityType}/${result.id}`);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: result.error || "Error desconocido." });
      }
    } catch {
      setMessage({ type: "error", text: "Error inesperado." });
    }
    return null;
  }, null);

  async function handleStatusChange(newStatus: string) {
    if (!initialData?.id) return;
    try {
      const result = await changeEntityStatus(entityType, String(initialData.id), newStatus);
      if (result.success) {
        setCurrentStatus(newStatus);
        setMessage({ type: "success", text: `Estado cambiado a "${newStatus}".` });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Error al cambiar estado." });
      }
    } catch {
      setMessage({ type: "error", text: "Error al cambiar estado." });
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    try {
      const result = await deleteEntity(entityType, String(initialData.id));
      if (result.success) {
        router.push(`/admin/content/${entityType}`);
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Error al eliminar." });
      }
    } catch {
      setMessage({ type: "error", text: "Error al eliminar." });
    }
  }

  async function handleRestore() {
    if (!initialData?.id) return;
    try {
      const result = await restoreEntity(entityType, String(initialData.id));
      if (result.success) {
        setMessage({ type: "success", text: "Registro restaurado." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Error al restaurar." });
      }
    } catch {
      setMessage({ type: "error", text: "Error al restaurar." });
    }
  }

  function renderField(field: EntityDef["fields"][0], value: string | undefined): React.ReactNode {
    const inputName = fieldToInputName(field.name);
    const baseInputClass =
      "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

    if (field.hidden) return null;

    switch (field.type) {
      case "textarea":
      case "richtext":
        return (
          <textarea
            id={inputName}
            name={inputName}
            defaultValue={value ?? ""}
            rows={field.type === "richtext" ? 12 : 5}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "number":
        return (
          <input
            id={inputName}
            name={inputName}
            type="number"
            defaultValue={value ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "date":
        return (
          <input
            id={inputName}
            name={inputName}
            type="date"
            defaultValue={value ?? ""}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "datetime":
        return (
          <input
            id={inputName}
            name={inputName}
            type="datetime-local"
            defaultValue={value ?? ""}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "time":
        return (
          <input
            id={inputName}
            name={inputName}
            type="time"
            defaultValue={value ?? ""}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "url":
        return (
          <input
            id={inputName}
            name={inputName}
            type="url"
            defaultValue={value ?? ""}
            placeholder={field.placeholder || "https://"}
            className={baseInputClass}
          />
        );

      case "email":
        return (
          <input
            id={inputName}
            name={inputName}
            type="email"
            defaultValue={value ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        );

      case "select":
        return (
          <select
            id={inputName}
            name={inputName}
            defaultValue={value ?? (field.options?.[0]?.value || "")}
            required={field.required}
            className={baseInputClass}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "image":
        return (
          <input
            id={inputName}
            name={inputName}
            type="url"
            defaultValue={value ?? ""}
            placeholder="https://media.centrocristianoberea.org/..."
            className={baseInputClass}
          />
        );

      case "json":
        return (
          <textarea
            id={inputName}
            name={inputName}
            defaultValue={value ?? ""}
            rows={4}
            placeholder={field.placeholder || '{"key": "value"}'}
            className={`${baseInputClass} font-mono text-xs`}
          />
        );

      default:
        return (
          <input
            id={inputName}
            name={inputName}
            type="text"
            defaultValue={value ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        );
    }
  }

  return (
    <div>
      {message && (
        <div
          className={`mb-6 rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing && initialData && config.statusField && (
        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Estado:</span>
              <CmsStatusBadge status={currentStatus} />
            </div>
            <div className="flex items-center gap-2">
              {config.statusTransitions?.[currentStatus]?.map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => handleStatusChange(target)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    target === "published" || target === "active"
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : target === "archived" || target === "inactive"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {target === "published"
                    ? "Publicar"
                    : target === "active"
                      ? "Activar"
                      : target === "draft"
                        ? "Despublicar"
                        : target === "inactive"
                          ? "Desactivar"
                          : target === "archived"
                            ? "Archivar"
                            : target}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="text-sm font-semibold">Información</h2>
          </div>
          <div className="space-y-4 p-6">
            {config.fields
              .filter((f) => !f.hidden && f.name !== "status")
              .map((field) => {
                const rawValue = initialData?.[field.name];
                const displayValue =
                  rawValue !== undefined ? formatInitialValue(rawValue, field.type) : "";
                return (
                  <div key={field.name}>
                    <label
                      htmlFor={fieldToInputName(field.name)}
                      className="mb-1.5 block text-sm font-medium"
                    >
                      {field.label}
                      {field.required && <span className="ml-1 text-destructive">*</span>}
                    </label>
                    {renderField(field, displayValue)}
                    {field.help && (
                      <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {isEditing && config.statusField && (
          <div className="hidden">
            <input type="hidden" name="field_to_input_name(status)" value={currentStatus} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditing && config.softDelete && initialData && (
              <>
                {initialData["deletedAt"] ? (
                  <button
                    type="button"
                    onClick={handleRestore}
                    className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Undo2 className="h-4 w-4" />
                    Restaurar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                )}
              </>
            )}
            {!config.softDelete && isEditing && initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar permanentemente
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/content/${entityType}`)}
              className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Guardar cambios" : "Crear registro"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
