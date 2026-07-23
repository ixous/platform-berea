interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className={`mb-4 h-1 w-12 rounded-full bg-berea-gold ${centered ? "mx-auto" : ""}`} />
      <h2 className="text-balance text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-base text-berea-muted">{subtitle}</p>
      )}
    </div>
  );
}
