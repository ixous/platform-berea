import { db } from "@/lib/db";
import { donations, institutionalPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EmptySection } from "@/components/public/EmptySection";
import { Heart, Building, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

type PaymentInfo = { bank?: string; account?: string; clabe?: string }[];

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "donaciones"))
    .limit(1);
  if (!page) return { title: "Donaciones" };
  return {
    title: page.metaTitle || "Donaciones",
    description: page.metaDescription || "Apoya económicamente la obra de Centro Cristiano Berea.",
    openGraph: {
      title: page.metaTitle
        ? `${page.metaTitle} | Centro Cristiano Berea`
        : "Donaciones | Centro Cristiano Berea",
      description:
        page.metaDescription || "Apoya económicamente la obra de Centro Cristiano Berea.",
    },
  };
}

export default async function DonacionesPage() {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "donaciones"))
    .limit(1);
  if (!page || !page.published) {
    return <EmptySection title="Donaciones" message="Información de donaciones no disponible." />;
  }

  const [info] = await db.select().from(donations).where(eq(donations.status, "active")).limit(1);
  const bankData = (info?.bankInfo as PaymentInfo) ?? [];
  const ctaText = info?.ctaButtonText || "Contáctanos";
  const ctaHref = info?.ctaButtonHref || "/contacto";
  const fallbackMessage = info?.message;

  return (
    <>
      <PageBanner
        title={page.bannerTitle || "Donaciones"}
        subtitle={page.bannerSubtitle || "Apoya la obra del Señor con tus ofrendas."}
        backgroundImage={page.bannerImage || "/images/banner-donaciones.png"}
      />

      <ContentBlock variant="gold-mist">
        {info ? (
          <>
            <ScrollReveal animation="fade-up">
              <ContentNarrow className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
                  <Heart className="h-10 w-10 text-berea-gold" />
                </div>
                <SectionHeading title={info.title} subtitle={info.description || undefined} />
              </ContentNarrow>
            </ScrollReveal>

            {bankData.length > 0 && (
              <>
                <ScrollReveal animation="fade-up" className="mt-8">
                  <div className="mx-auto flex items-center gap-4 text-center justify-center">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-berea-gold/30" />
                    <span className="text-sm font-semibold uppercase tracking-widest text-berea-gold">
                      Transferencia Bancaria
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-berea-gold/30" />
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-10">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {bankData.map((b, i) => (
                      <MediaCard
                        key={i}
                        variant="icon"
                        icon={i % 2 === 0 ? Building : CreditCard}
                        title={b.bank || "Banco"}
                        meta={
                          <div className="space-y-1.5">
                            {b.account && (
                              <p className="flex items-center gap-2">
                                <span className="font-medium text-berea-navy">Cuenta:</span>
                                <span className="text-berea-muted font-mono text-xs">
                                  {b.account}
                                </span>
                              </p>
                            )}
                            {b.clabe && (
                              <p className="flex items-center gap-2">
                                <span className="font-medium text-berea-navy">CLABE:</span>
                                <span className="text-berea-muted font-mono text-xs break-all">
                                  {b.clabe}
                                </span>
                              </p>
                            )}
                          </div>
                        }
                      />
                    ))}
                  </div>
                </ScrollReveal>
              </>
            )}
          </>
        ) : (
          <ScrollReveal animation="fade-up" className="mt-16">
            <div className="mx-auto max-w-lg">
              <div className="rounded-2xl border border-berea-border/40 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-berea-gold/10 to-berea-navy/5">
                  <Heart className="h-8 w-8 text-berea-gold" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-berea-navy">Donaciones</h3>
                {fallbackMessage ? (
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-berea-muted">
                    {fallbackMessage}
                  </p>
                ) : (
                  <>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-berea-muted">
                      Tu generosidad nos ayuda a continuar compartiendo el mensaje de Jesucristo,
                      fortaleciendo los ministerios de la iglesia y sirviendo a nuestra comunidad.
                    </p>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-berea-muted">
                      Si deseas apoyar esta obra, puedes comunicarte directamente con nosotros para
                      conocer las diferentes formas de colaborar.
                    </p>
                    <p className="mx-auto mt-6 max-w-md text-sm font-medium text-berea-navy">
                      Agradecemos profundamente cada oración, ofrenda y muestra de amor hacia esta
                      casa.
                    </p>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" className="mt-12">
          <div className="text-center">
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
