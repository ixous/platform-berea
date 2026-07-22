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
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/devocionales"
        className="inline-flex items-center gap-1 text-sm text-berea-muted transition-colors hover:text-berea-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Todos los devocionales
      </Link>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-berea-gold">
        Devocional
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
        {item.title}
      </h1>

      {item.verse && (
        <blockquote className="mt-6 rounded-lg border-l-4 border-berea-gold bg-berea-light p-4 italic text-berea-muted">
          {item.verse}
        </blockquote>
      )}

      {item.publishedAt && (
        <p className="mt-4 text-sm text-berea-muted">
          Publicado el{" "}
          {new Date(item.publishedAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      <div className="prose prose-lg mx-auto mt-8 max-w-none text-berea-navy/80">
        {item.content.split("\n").map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
