"use client";

import { createContext, useContext, useState, useCallback, useTransition } from "react";

export interface BlockField {
  name: string;
  label: string;
  type: "text" | "textarea" | "image";
}

export interface BlockConfig {
  key: string;
  label: string;
  fields: BlockField[];
}

interface VisualEditorState {
  selectedBlock: string | null;
  blockValues: Record<string, Record<string, string>>;
  saving: boolean;
  selectBlock: (key: string | null) => void;
  updateField: (blockKey: string, fieldName: string, value: string) => void;
  saveBlock: (blockKey: string) => Promise<void>;
  getBlockValues: (blockKey: string) => Record<string, string>;
}

const VisualEditorContext = createContext<VisualEditorState | null>(null);

export function useVisualEditor() {
  const ctx = useContext(VisualEditorContext);
  if (!ctx) throw new Error("useVisualEditor must be used within VisualEditorShell");
  return ctx;
}

export function VisualEditorProvider({
  blocks,
  initialData,
  onSaveBlock,
  children,
}: {
  blocks: BlockConfig[];
  initialData?: Record<string, string>;
  onSaveBlock: (blockKey: string, data: Record<string, string>) => Promise<void>;
  children: React.ReactNode;
}) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [blockValues, setBlockValues] = useState<Record<string, Record<string, string>>>({});
  const [isPending, startTransition] = useTransition();

  const selectBlock = useCallback((key: string | null) => {
    setSelectedBlock(key);
  }, []);

  const updateField = useCallback((blockKey: string, fieldName: string, value: string) => {
    setBlockValues((prev) => ({
      ...prev,
      [blockKey]: { ...(prev[blockKey] || {}), [fieldName]: value },
    }));
  }, []);

  const getBlockValues = useCallback(
    (blockKey: string): Record<string, string> => {
      const block = blocks.find((b) => b.key === blockKey);
      if (!block) return {};

      const overrides = blockValues[blockKey] || {};
      const result: Record<string, string> = {};

      for (const field of block.fields) {
        const key = field.name;
        result[key] = overrides[key] ?? initialData?.[key] ?? "";
      }

      return result;
    },
    [blocks, blockValues, initialData]
  );

  const saveBlock = useCallback(
    async (blockKey: string) => {
      const data = getBlockValues(blockKey);

      startTransition(async () => {
        await onSaveBlock(blockKey, data);
      });
    },
    [getBlockValues, onSaveBlock]
  );

  return (
    <VisualEditorContext.Provider
      value={{
        selectedBlock,
        blockValues,
        saving: isPending,
        selectBlock,
        updateField,
        saveBlock,
        getBlockValues,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}
