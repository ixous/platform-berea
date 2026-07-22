interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className="text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-berea-muted">{subtitle}</p>}
    </div>
  );
}
