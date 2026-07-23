interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div
        className={`mb-6 flex items-center justify-center gap-3 ${centered ? "" : ""}`}
      >
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-berea-gold/40" />
        <span className="h-1 w-12 rounded-full bg-gradient-to-r from-berea-gold/60 to-berea-gold" />
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-berea-gold/40" />
      </div>
      <h2
        className={`text-balance text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-berea-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed ${
            light ? "text-white/70" : "text-berea-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
