import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Quote } from "lucide-react";
import { BereaImage } from "@/components/public/BereaImage";
import { DEVOTIONAL_IMAGES, DEVOTIONAL_FALLBACK } from "@/lib/public/symbolic-images";
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

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
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

  const readTime = estimateReadTime(item.content);
  const heroImage = item.imageUrl || DEVOTIONAL_IMAGES[item.slug] || DEVOTIONAL_FALLBACK;

  return (
    <article>
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-berea-navy via-berea-navy to-berea-navy/90 sm:h-80 lg:h-96">
        <BereaImage src={heroImage} alt="" fill className="opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-berea-navy via-berea-navy/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
            <Link
              href="/devocionales"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos los devocionales
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 relative z-10 rounded-2xl border border-berea-border/40 bg-white p-8 shadow-xl sm:p-12">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-berea-gold/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-berea-gold ring-1 ring-berea-gold/10">
              <BookOpen className="h-3.5 w-3.5" />
              Devocional
            </span>
            {item.publishedAt && (
              <span className="text-berea-muted">
                {new Date(item.publishedAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="text-berea-muted/60">&middot;</span>
            <span className="text-berea-muted">{readTime} min de lectura</span>
          </div>

          <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>
        </div>

        {item.verse && (
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative rounded-2xl bg-gradient-to-br from-berea-navy/5 to-berea-gold/5 p-8 sm:p-10">
              <Quote className="absolute right-6 top-6 h-12 w-12 text-berea-gold/10" />
              <div className="relative">
                <p className="text-lg font-medium leading-relaxed text-berea-navy/80 sm:text-xl">
                  &ldquo;{item.verse}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="space-y-6 text-base leading-8 text-berea-navy/80 sm:text-lg">
            {item.content.split("\n").map((p, i) => {
              const trimmed = p.trim();
              if (!trimmed) return null;
              return (
                <p key={i} className="text-pretty">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl border-t border-berea-border/60 pt-8 pb-20">
          <Link
            href="/devocionales"
            className="group inline-flex items-center gap-2 rounded-xl border border-berea-border/60 bg-white px-6 py-3 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-berea-gold/30 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Todos los devocionales
          </Link>
        </div>
      </div>
    </article>
  );
}
