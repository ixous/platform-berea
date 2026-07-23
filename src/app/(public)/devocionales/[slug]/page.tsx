import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(devotionals)
    .where(
      and(
        eq(devotionals.slug, slug),
        eq(devotionals.status, "published"),
        isNull(devotionals.deletedAt)
      )
    )
    .limit(1);

  if (!item) return { title: "Devocional no encontrado" };

  return { title: item.title, description: item.excerpt || item.title };
}

export default async function DevocionalDetallePage({ params }: Props) {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(devotionals)
    .where(
      and(
        eq(devotionals.slug, slug),
        eq(devotionals.status, "published"),
        isNull(devotionals.deletedAt)
      )
    )
    .limit(1);

  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-up">
      <Link
        href="/devocionales"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-berea-muted transition-colors hover:text-berea-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Todos los devocionales
      </Link>

      <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-berea-gold">
        Devocional
      </p>
      <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
        {item.title}
      </h1>

      {item.verse && (
        <blockquote className="mt-8 rounded-xl border-l-4 border-berea-gold bg-berea-light p-6 italic leading-relaxed text-berea-muted">
          {item.verse}
        </blockquote>
      )}

      {item.publishedAt && (
        <p className="mt-6 text-sm text-berea-muted">
          Publicado el{" "}
          {new Date(item.publishedAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      <div className="mt-10 space-y-5 leading-relaxed text-berea-navy/80">
        {item.content.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
