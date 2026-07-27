"use client";

import { useRef, useState, useEffect } from "react";
import { useVisualEditor } from "./VisualEditorContext";

interface VisualBlockProps {
  blockKey: string;
  label: string;
  children: React.ReactNode;
}

export function VisualBlock({ blockKey, label, children }: VisualBlockProps) {
  const { selectedBlock, selectBlock } = useVisualEditor();
  const isSelected = selectedBlock === blockKey;
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        setHoveredLink(href || "enlace");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      if (!target.closest("a") && !related?.closest("a")) {
        setHoveredLink(null);
      }
    };

    el.addEventListener("mouseover", onMouseOver);
    el.addEventListener("mouseout", onMouseOut);
    return () => {
      el.removeEventListener("mouseover", onMouseOver);
      el.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    const button = target.closest("button");

    if (anchor || button) {
      e.preventDefault();
    }

    selectBlock(blockKey);
  };

  return (
    <div
      ref={blockRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectBlock(blockKey);
        }
      }}
      className={`group relative cursor-pointer transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-berea-gold ring-offset-2"
          : "hover:ring-2 hover:ring-berea-gold/50 hover:ring-offset-1"
      }`}
    >
      <div className="absolute right-3 top-3 z-50 rounded bg-berea-gold px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </div>

      {hoveredLink && !isSelected && (
        <div className="absolute bottom-3 left-3 z-50 rounded bg-berea-navy px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg pointer-events-none">
          Editar {label.toLowerCase()}
        </div>
      )}

      {children}
    </div>
  );
}
