import { BereaImage } from "./BereaImage";
import { ParallaxLayer } from "./ParallaxLayer";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

export function PageBanner({
  title,
  subtitle,
  backgroundImage,
}: PageBannerProps) {
  return (
    <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-berea-navy sm:min-h-[440px] lg:min-h-[520px]">
      {backgroundImage ? (
        <>
          <ParallaxLayer speed={0.04} className="absolute inset-0">
            <BereaImage
              src={backgroundImage}
              alt="Centro Cristiano Berea"
              fill
              priority
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.12),transparent_60%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.04),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_50%)]" />
        </>
      )}

      <div className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-berea-gold/40" />
            <span className="h-1 w-16 rounded-full bg-gradient-to-r from-berea-gold/60 to-berea-gold" />
            <span className="h-px w-10 bg-berea-gold/40" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
