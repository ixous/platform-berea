import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { EmptySection } from "@/components/public/EmptySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liderazgo",
  description:
    "Conoce a los pastores y l\u00edderes que gu\u00edan a Centro Cristiano Berea en Mexicali, Baja California.",
};

async function getLeaders() {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(and(eq(users.status, "active"), isNull(users.deletedAt)))
    .limit(12);
}

export default async function LiderazgoPage() {
  const leaders = await getLeaders();

  return (
    <>
      <PageBanner title="Liderazgo" subtitle="Conoce a quienes gu\u00edan nuestra iglesia." />

      {leaders.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="rounded-lg border border-berea-border bg-white p-6 text-center"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-berea-navy/10">
                    <span className="text-3xl font-bold text-berea-navy/30">
                      {leader.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-berea-navy">{leader.name}</h3>
                  <p className="text-sm text-berea-muted">L&iacute;der</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Liderazgo"
          message="Pr\u00f3ximamente podr\u00e1s conocer a los pastores y l\u00edderes de nuestra iglesia."
        />
      )}
    </>
  );
}
