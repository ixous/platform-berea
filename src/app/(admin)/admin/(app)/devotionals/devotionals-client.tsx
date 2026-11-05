"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Star,
  Search,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import {
  createDevotional,
  updateDevotional,
  deleteDevotional,
  toggleDevotionalStatus,
} from "./actions";

export interface DevotionalRow {
  id: string;
  title: string;
  slug: string;
  verse: string | null;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  featured: boolean;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
}

interface Props {
  initialItems: DevotionalRow[];
}

export function DevotionalsClient({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<DevotionalRow[]>(initialItems);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal de Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    verse: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    featured: false,
    status: "published" as "published" | "draft",
  });

  const [formError, setFormError] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.verse && item.verse.toLowerCase().includes(search.toLowerCase())) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      verse: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      featured: true,
      status: "published",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: DevotionalRow) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      verse: item.verse || "",
      excerpt: item.excerpt || "",
      content: item.content,
      imageUrl: item.imageUrl || "",
      featured: Boolean(item.featured),
      status: (item.status as "published" | "draft") || "published",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Por favor escribe el título del devocional.");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Por favor escribe el contenido o reflexión del devocional.");
      return;
    }

    startTransition(async () => {
      try {
        if (editingId) {
          await updateDevotional(editingId, form);
        } else {
          await createDevotional(form);
        }
        setIsModalOpen(false);
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Error al guardar");
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar el devocional "${title}"?`)) return;

    startTransition(async () => {
      try {
        await deleteDevotional(id);
        setItems((prev) => prev.filter((it) => it.id !== id));
        router.refresh();
      } catch (err) {
        alert("Error al eliminar");
      }
    });
  };

  const handleToggleStatus = async (id: string) => {
    startTransition(async () => {
      try {
        const res = await toggleDevotionalStatus(id);
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: res.status } : it)));
        router.refresh();
      } catch {
        alert("Error al cambiar estado");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar devocionales por título, versículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Devocional</span>
        </button>
      </div>

      {/* Lista de Devocionales */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-base font-semibold">No hay devocionales registrados</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea el primer devocional de Centro Cristiano Berea para la iglesia.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Devocional</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="divide-y">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-semibold text-base">{item.title}</h4>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                        <Star className="h-3 w-3 fill-current" />
                        Destacado
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                        item.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {item.status === "published" ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Publicado
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" /> Borrador
                        </>
                      )}
                    </button>
                  </div>

                  {item.verse && (
                    <p className="text-xs font-medium text-amber-700/80 italic">{item.verse}</p>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.excerpt || item.content}
                  </p>

                  <p className="text-[11px] text-muted-foreground/70">
                    {item.publishedAt
                      ? `Publicado el ${new Date(item.publishedAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : "Aún no publicado"}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/devocionales/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver página pública"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    title="Editar devocional"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Eliminar devocional"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Formulario Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Editar Devocional" : "Nuevo Devocional Berea"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Título del Devocional *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Caminando en Gracia y Verdad"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-10 w-full rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Versículo o Pasaje Bíblico Clave
                </label>
                <input
                  type="text"
                  placeholder="Ej: Romanos 8:28 - Sabemos que a los que aman a Dios..."
                  value={form.verse}
                  onChange={(e) => setForm({ ...form, verse: e.target.value })}
                  className="h-10 w-full rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resumen o Extracto Breve
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve frase que enganche en la tarjeta de inicio..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contenido / Reflexión Completa *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Escribe aquí toda la reflexión bíblica, puntos y oración para la congregación..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  URL de Imagen (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="https://... o /images/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="h-10 w-full rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span>Destacar en Portada</span>
                </label>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as "published" | "draft" })
                    }
                    className="h-8 rounded-lg border bg-background px-2.5 text-xs font-semibold"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>
              </div>

              {/* Pie con botones */}
              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingId ? "Actualizar" : "Guardar Devocional"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
