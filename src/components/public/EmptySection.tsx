interface EmptySectionProps {
  title: string;
  message: string;
}

export function EmptySection({ title, message }: EmptySectionProps) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-berea-gold">{title}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
          Pr&oacute;ximamente
        </h2>
        <p className="mt-4 text-base text-berea-muted">{message}</p>
      </div>
    </section>
  );
}
