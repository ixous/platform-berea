import { db } from "@/lib/db";
import { donations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { Heart, Banknote } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donaciones",
  description:
    "Apoya econ\u00f3micamente la obra de Centro Cristiano Berea. Tu ofrenda hace una diferencia.",
  openGraph: {
    title: "Donaciones | Centro Cristiano Berea",
    description:
      "Apoya econ\u00f3micamente la obra de Centro Cristiano Berea. Tu ofrenda hace una diferencia.",
  },
};

async function getDonationsInfo() {
  const [row] = await db
    .select()
    .from(donations)
    .where(and(eq(donations.status, "active")))
    .limit(1);
  return row;
}

type PaymentInfo = { bank?: string; account?: string; clabe?: string }[];

export default async function DonacionesPage() {
  const info = await getDonationsInfo();
  const bankData = (info?.bankInfo as PaymentInfo) ?? [];

  return (
    <>
      <PageBanner title="Donaciones" subtitle="Tu generosidad ayuda a extender el Reino de Dios." />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-berea-gold" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
              {info?.title || "Ofrenda con un coraz\u00f3n generoso"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-berea-muted">
              {info?.description ||
                "Cada aportaci\u00f3n contribuye a la obra de Dios, permitiendo que el Evangelio siga siendo predicado."}
            </p>
          </div>

          {bankData.length > 0 ? (
            <div className="space-y-4">
              {bankData.map((b, i) => (
                <div key={i} className="rounded-lg border border-berea-border bg-white p-6">
                  <p className="font-semibold text-berea-navy">{b.bank || "Banco"}</p>
                  {b.account && (
                    <p className="mt-1 text-sm text-berea-muted">Cuenta: {b.account}</p>
                  )}
                  {b.clabe && <p className="mt-1 text-sm text-berea-muted">CLABE: {b.clabe}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-berea-border bg-berea-light p-8 text-center">
              <Banknote className="mx-auto h-10 w-10 text-berea-muted" />
              <h3 className="mt-4 text-lg font-bold text-berea-navy">Informaci\u00f3n pendiente</h3>
              <p className="mt-2 text-sm text-berea-muted">
                Los datos bancarios, cuentas y m\u00e9todos de donaci\u00f3n se configurar\u00e1n
                desde el CMS cuando el equipo de Centro Cristiano Berea proporcione la
                informaci\u00f3n oficial.
              </p>
              <p className="mt-2 text-sm text-berea-muted">
                En el futuro se integrar\u00e1 Stripe para facilitar donaciones en l\u00ednea.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-berea-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Cont\u00e1ctanos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
