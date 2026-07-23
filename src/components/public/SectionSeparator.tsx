interface SectionSeparatorProps {
  variant?: "wave" | "curve";
}

export function SectionSeparator({ variant = "wave" }: SectionSeparatorProps) {
  if (variant === "curve") {
    return (
      <div className="relative h-16 w-full overflow-hidden">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20C240 60 480 60 720 40C960 20 1200 20 1440 40V64H0V20Z"
              fill="currentColor"
              className="text-white"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 32C240 56 480 56 720 40C960 24 1200 24 1440 32V64H0V32Z"
            fill="currentColor"
            className="text-[#fafafa]"
          />
        </svg>
      </div>
    </div>
  );
}
