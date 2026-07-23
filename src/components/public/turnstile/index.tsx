"use client";

import Script from "next/script";
import { useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
      }) => void;
      remove: () => void;
    };
  }
}

export function TurnstileWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  const onLoadScript = useCallback(() => {
    if (rendered.current) return;
    if (containerRef.current && window.turnstile) {
      window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
        callback: (token: string) => {
          const input = document.querySelector<HTMLInputElement>(
            'input[name="cf-turnstile-response"]'
          );
          if (input) input.value = token;
        },
        "expired-callback": () => {
          const input = document.querySelector<HTMLInputElement>(
            'input[name="cf-turnstile-response"]'
          );
          if (input) input.value = "";
        },
      });
      rendered.current = true;
    }
  }, []);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={onLoadScript}
      />
      <div ref={containerRef} className="cf-turnstile" />
      <input type="hidden" name="cf-turnstile-response" />
    </>
  );
}
