import { BereaImage } from "./BereaImage";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

export function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
  return (
    <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-berea-navy">
      {backgroundImage ? (
        <>
          <BereaImage
            src={backgroundImage}
            alt="Centro Cristiano Berea"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_50%)]" />
      )}

      <div className="relative px-4 py-16 sm:px-6 lg:px-8">
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
