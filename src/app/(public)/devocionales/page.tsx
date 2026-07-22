import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { and, isNull, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { PageBanner } from "@/components/public/PageBanner";
import { EmptySection } from "@/components/public/EmptySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devocionales",
  description:
    "Reflexiones b\u00edblicas para tu crecimiento espiritual. Devocionales de Centro Cristiano Berea.",
};

async function getDevotionals() {
  return db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
    .orderBy(desc(devotionals.publishedAt))
    .limit(20);
}

export default async function DevocionalesPage() {
  const items = await getDevotionals();

  return (
    <>
      <PageBanner title="Devocionales" subtitle="Reflexiones b\u00edblicas para tu crecimiento." />

      {items.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((d) => (
                <Link
                  key={d.id}
                  href={`/devocionales/${d.slug}`}
                  className="group rounded-lg border border-berea-border bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-berea-gold">
                    Devocional
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-berea-navy group-hover:text-berea-gold">
                    {d.title}
                  </h3>
                  {d.verse && <p className="mt-2 text-sm italic text-berea-muted">{d.verse}</p>}
                  {d.excerpt && (
                    <p className="mt-3 text-sm text-berea-muted line-clamp-3">{d.excerpt}</p>
                  )}
                  {d.publishedAt && (
                    <p className="mt-3 text-xs text-berea-muted">
                      {new Date(d.publishedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Devocionales"
          message="Pr\u00f3ximamente publicaremos devocionales para tu crecimiento espiritual."
        />
      )}
    </>
  );
}
