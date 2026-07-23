import Image from "next/image";

interface BereaImageProps {
  src?: string | null;
  alt?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  aspectRatio?: "square" | "video" | "wide" | "banner";
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/7]",
  banner: "aspect-[16/4]",
} as const;

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGYyNzQ3MDgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2M5YTIyNzY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkNDQjwvdGV4dD48L3N2Zz4=";

export function BereaImage({
  src,
  alt = "",
  priority = false,
  fill,
  width,
  height,
  className = "",
  sizes,
  aspectRatio,
}: BereaImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-berea-navy/5 ${aspectRatio ? aspectRatios[aspectRatio] : ""} ${className}`}
        role="img"
        aria-label={alt || "Imagen no disponible"}
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-berea-navy/10">
            <span className="text-lg font-bold text-berea-navy/20">CCB</span>
          </div>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover ${className}`}
        sizes={sizes || "100vw"}
        placeholder="blur"
        blurDataURL={PLACEHOLDER}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      priority={priority}
      className={`object-cover ${aspectRatio ? aspectRatios[aspectRatio] : ""} ${className}`}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={PLACEHOLDER}
    />
  );
}
