import { BereaImage } from "./BereaImage";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

export function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-berea-navy">
      {backgroundImage ? (
        <>
          <BereaImage
            src={backgroundImage}
            alt=""
            fill
            className="brightness-[0.3] saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-berea-navy/80 to-berea-navy/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_50%)]" />
      )}

      <div className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-berea-gold/60" />
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg text-white/70">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
