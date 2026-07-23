interface SectionSeparatorProps {
  variant?: "wave" | "curve" | "angle" | "wave-gold" | "curve-gold";
}

export function SectionSeparator({ variant = "wave-gold" }: SectionSeparatorProps) {
  if (variant === "curve") {
    return (
      <div className="relative h-20 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
              <stop offset="50%" stopColor="#fafafa" stopOpacity="1" />
              <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 30C240 70 480 70 720 50C960 30 1200 30 1440 50V80H0V30Z"
            fill="url(#curveGrad)"
          />
        </svg>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="relative h-20 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#eef1f5" stopOpacity="0" />
              <stop offset="50%" stopColor="#eef1f5" stopOpacity="1" />
              <stop offset="100%" stopColor="#eef1f5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 40C240 64 480 64 720 48C960 32 1200 32 1440 48V80H0V40Z"
            fill="url(#waveGrad)"
          />
        </svg>
      </div>
    );
  }

  if (variant === "angle") {
    return (
      <div className="relative h-20 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="angleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5f7fa" stopOpacity="0" />
              <stop offset="100%" stopColor="#f5f7fa" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d="M0 0L1440 80L1440 80L0 80Z" fill="url(#angleGrad)" />
        </svg>
      </div>
    );
  }

  if (variant === "curve-gold") {
    return (
      <div className="relative h-24 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0" />
              <stop offset="50%" stopColor="#c9a227" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 40C240 80 480 80 720 56C960 32 1200 32 1440 56V96H0V40Z"
            fill="url(#curveGoldGrad)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-24 w-full overflow-hidden">
      <svg
        viewBox="0 0 1440 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGoldGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0" />
            <stop offset="50%" stopColor="#c9a227" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 48C240 72 480 72 720 56C960 40 1200 40 1440 56V96H0V48Z"
          fill="url(#waveGoldGrad)"
        />
      </svg>
    </div>
  );
}
