import type { ReactNode } from "react";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "cream"
    | "gradient"
    | "warm"
    | "gold-mist"
    | "light"
    | "navy"
    | "navy-warm";
}

const variants = {
  default: "bg-white",
  cream: "bg-section-warm",
  gradient: "bg-section-warm",
  warm: "bg-section-warm",
  "gold-mist": "bg-section-gold-mist",
  light: "bg-section-light",
  navy: "bg-section-navy text-white",
  "navy-warm": "bg-section-navy-warm text-white",
};

export function ContentBlock({
  children,
  className = "",
  variant = "default",
}: ContentBlockProps) {
  return (
    <section
      className={`relative px-4 py-28 sm:px-6 lg:px-8 ${variants[variant]} ${className}`}
    >
      {variant === "gold-mist" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      )}
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function ContentNarrow({ children, className = "" }: ContentBlockProps) {
  return (
    <div className={`mx-auto max-w-3xl ${className}`}>{children}</div>
  );
}
