interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="bg-berea-navy px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
