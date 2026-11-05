"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      toggle?: () => void;
      popup?: () => void;
      showWidget?: () => void;
      hideWidget?: () => void;
      setAttributes?: (attributes: Record<string, string>, callback?: () => void) => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export function LiveCounselingChat() {
  const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID || "default";

  useEffect(() => {
    if (!propertyId) return;

    // Evitar duplicar el script si ya fue inyectado
    const existingScript = document.getElementById("tawk-to-script");
    if (existingScript) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawk-to-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.head.appendChild(script);

    return () => {
      // Cleanup si el componente se desmonta
      const s = document.getElementById("tawk-to-script");
      if (s) s.remove();
    };
  }, [propertyId, widgetId]);

  return null;
}
