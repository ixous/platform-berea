"use client";

import { VisualEditorProvider, type BlockConfig } from "./VisualEditorContext";
import { VisualEditorPanel } from "./VisualEditorPanel";
import { VisualPreviewCapture } from "./VisualPreviewCapture";

interface VisualEditorShellProps {
  blocks: BlockConfig[];
  initialData?: Record<string, string>;
  onSaveBlock: (blockKey: string, data: Record<string, string>) => Promise<void>;
  children: React.ReactNode;
}

export function VisualEditorShell({
  blocks,
  initialData,
  onSaveBlock,
  children,
}: VisualEditorShellProps) {
  return (
    <VisualEditorProvider blocks={blocks} initialData={initialData} onSaveBlock={onSaveBlock}>
      <div className="flex h-[calc(100vh-12rem)] gap-6">
        <VisualPreviewCapture>
          <div className="flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm">
            {children}
          </div>
        </VisualPreviewCapture>
        <div
          data-editor-panel
          className="hidden w-80 shrink-0 overflow-hidden rounded-xl border bg-card shadow-sm lg:block"
        >
          <VisualEditorPanel blocks={blocks} />
        </div>
        <div className="fixed inset-0 z-50 flex lg:hidden" data-editor-panel>
          <div className="flex-1 bg-black/50" onClick={() => {}} />
          <div className="w-80 overflow-hidden border-l bg-card shadow-2xl">
            <VisualEditorPanel blocks={blocks} />
          </div>
        </div>
      </div>
    </VisualEditorProvider>
  );
}
