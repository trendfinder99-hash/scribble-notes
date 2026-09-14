"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrawPad } from "@/components/draw-pad";

interface NoteComposerProps {
  onCreate: (kind: "text" | "checklist") => void;
  onCreateDrawing: (image: string) => void;
}

export function NoteComposer({ onCreate, onCreateDrawing }: NoteComposerProps) {
  const [kind, setKind] = useState<"text" | "checklist">("text");
  const [drawOpen, setDrawOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-10 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-stone-400/60 bg-white/60 p-4 backdrop-blur-sm dark:border-stone-600/60 dark:bg-stone-900/40 sm:flex-row sm:justify-between"
      >
        <div className="flex items-center gap-1 rounded-full bg-stone-900/5 p-1 dark:bg-white/5">
          <button
            onClick={() => setKind("text")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition",
              kind === "text"
                ? "bg-white text-stone-900 shadow dark:bg-stone-700 dark:text-white"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
            )}
          >
            <FileText className="h-4 w-4" /> Note
          </button>
          <button
            onClick={() => setKind("checklist")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition",
              kind === "checklist"
                ? "bg-white text-stone-900 shadow dark:bg-stone-700 dark:text-white"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
            )}
          >
            <CheckCircle className="h-4 w-4" /> Checklist
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawOpen(true)}
            className="flex items-center gap-1.5 rounded-full border-2 border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 transition hover:scale-105 hover:bg-stone-100 active:scale-95 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Edit className="h-4 w-4" /> Draw
          </button>
          <button
            onClick={() => onCreate(kind)}
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:bg-stone-800 active:scale-95 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <Plus className="h-4 w-4" /> Add {kind === "text" ? "note" : "checklist"}
          </button>
        </div>
      </motion.div>

      <DrawPad open={drawOpen} onOpenChange={setDrawOpen} onSave={onCreateDrawing} />
    </>
  );
}
