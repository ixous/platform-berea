interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div
        className={`mb-5 h-1 w-14 rounded-full bg-gradient-to-r from-berea-gold/80 to-berea-gold ${centered ? "mx-auto" : ""}`}
      />
      <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
