"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";

const emptySubscribe = () => () => {};

export function FacebookPagePlugin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pluginWidth, setPluginWidth] = useState<number>(340);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        // Facebook Page Plugin requiere un ancho entre 180 y 500 px
        const available = Math.floor(clientWidth);
        const clamped = Math.min(500, Math.max(280, available));
        setPluginWidth(clamped);
      }
    };

    updateWidth();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcentrocristianobereamxli&tabs=timeline%2Cevents&width=${pluginWidth}&height=650&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <div ref={containerRef} className="relative flex w-full justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm z-10 text-site-muted min-h-[500px]">
          <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
          <p className="text-xs font-semibold">Cargando publicaciones de Facebook...</p>
        </div>
      )}

      {isClient && (
        <iframe
          key={`fb-iframe-${pluginWidth}`}
          src={iframeSrc}
          width={pluginWidth}
          height={650}
          onLoad={() => setIsLoading(false)}
          style={{
            border: "none",
            overflow: "hidden",
            width: `${pluginWidth}px`,
            maxWidth: "100%",
          }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Muro y eventos en vivo de Centro Cristiano Berea"
          className="mx-auto rounded-2xl shadow-sm transition-opacity duration-300"
        />
      )}
    </div>
  );
}
