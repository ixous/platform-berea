"use client";

import { useVisualEditor } from "./VisualEditorContext";

interface VisualBlockProps {
  blockKey: string;
  label: string;
  children: React.ReactNode;
}

export function VisualBlock({ blockKey, label, children }: VisualBlockProps) {
  const { selectedBlock, selectBlock } = useVisualEditor();
  const isSelected = selectedBlock === blockKey;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => selectBlock(blockKey)}
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
      {children}
    </div>
  );
}
