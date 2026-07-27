"use client";

import { useRef, useEffect } from "react";

export function VisualPreviewCapture({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      const button = target.closest("button");

      if (anchor) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (button) {
        const isInEditorPanel = button.closest("[data-editor-panel]");
        if (!isInEditorPanel) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    container.addEventListener("click", handler, true);
    return () => container.removeEventListener("click", handler, true);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
