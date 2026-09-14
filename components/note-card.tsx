"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash, RefreshCw, Plus, X, Edit, MoreVertical } from "lucide-react";
import { Note } from "@/types";
import { NOTE_COLORS, nextColor, INK_COLORS } from "@/lib/colors";
import { makeId } from "@/lib/notes-storage";
import { useTheme } from "@/components/theme-provider";
import { DrawPad } from "@/components/draw-pad";
import { ColorPicker } from "@/components/color-picker";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}

export function NoteCard({
  note,
  onUpdate,
  onDelete,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
  registerRef,
}: NoteCardProps) {
  const [newItemText, setNewItemText] = useState("");
  const [drawOpen, setDrawOpen] = useState(false);
  const { theme } = useTheme();
  const palette = NOTE_COLORS[note.color];
  const bgColor = theme === "dark" ? palette.dark : palette.bg;
  const tapeColor = theme === "dark" ? palette.darkTape : palette.tape;
  const textStyle = note.textColor ? { color: note.textColor } : undefined;

  const totalItems = note.items.length;
  const doneItems = note.items.filter((i) => i.done).length;
  const allDone = totalItems > 0 && doneItems === totalItems;

  function addChecklistItem() {
    const text = newItemText.trim();
    if (!text) return;
    onUpdate(note.id, {
      items: [...note.items, { id: makeId(), text, done: false }],
    });
    setNewItemText("");
  }

  function toggleItem(itemId: string) {
    onUpdate(note.id, {
      items: note.items.map((i) =>
        i.id === itemId ? { ...i, done: !i.done } : i
      ),
    });
  }

  function removeItem(itemId: string) {
    onUpdate(note.id, {
      items: note.items.filter((i) => i.id !== itemId),
    });
  }

  function handleHandlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    onDragStart();
  }

  function handleHandlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    onDragMove(e.clientX, e.clientY);
  }

  function handleHandlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer capture may already be released
    }
    onDragEnd();
  }

  return (
    <motion.div
      ref={registerRef}
      layout
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{
        opacity: isDragging ? 0.4 : 1,
        scale: isDragging ? 0.96 : 1,
        y: 0,
        rotate: note.rotation,
      }}
      exit={{ opacity: 0, scale: 0.8, rotate: note.rotation * 2 }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative rounded-2xl p-5 pt-7 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 rounded-sm opacity-90 shadow-sm"
        style={{ backgroundColor: tapeColor }}
      />

      <button
        onPointerDown={handleHandlePointerDown}
        onPointerMove={handleHandlePointerMove}
        onPointerUp={handleHandlePointerUp}
        onPointerCancel={handleHandlePointerUp}
        style={{ touchAction: "none" }}
        aria-label="Drag to reorder"
        title="Drag to reorder"
        className="absolute -left-2 top-1/2 flex -translate-y-1/2 cursor-grab items-center justify-center rounded-full p-1 text-stone-700/50 transition hover:text-stone-900 active:cursor-grabbing dark:text-stone-300/50 dark:hover:text-white"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      <div className="mb-2 flex items-center justify-between gap-2">
        <input
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Untitled note"
          style={textStyle}
          className="w-full truncate bg-transparent font-[var(--font-hand)] text-lg font-bold text-stone-800 outline-none placeholder:text-stone-500 dark:text-stone-50 dark:placeholder:text-stone-300/70"
        />
        <div className="flex shrink-0 items-center gap-1">
          {note.kind !== "drawing" && (
            <ColorPicker
              value={note.textColor ?? "#1C1C1E"}
              onChange={(color) => onUpdate(note.id, { textColor: color })}
              swatches={INK_COLORS}
              label="Text color"
            />
          )}
          {note.kind === "drawing" && (
            <button
              aria-label="Edit drawing"
              onClick={() => setDrawOpen(true)}
              className="rounded-full p-1.5 text-stone-700/70 transition hover:bg-black/10 hover:text-stone-900 dark:text-stone-200/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          <button
            aria-label="Change color"
            onClick={() => onUpdate(note.id, { color: nextColor(note.color) })}
            className="rounded-full p-1.5 text-stone-700/70 transition hover:bg-black/10 hover:text-stone-900 dark:text-stone-200/80 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            aria-label="Delete note"
            onClick={() => onDelete(note.id)}
            className="rounded-full p-1.5 text-stone-700/70 transition hover:bg-black/10 hover:text-red-700 dark:text-stone-200/80 dark:hover:bg-white/10 dark:hover:text-red-400"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {note.kind === "text" && (
        <textarea
          value={note.body}
          onChange={(e) => onUpdate(note.id, { body: e.target.value })}
          placeholder="Write something..."
          rows={4}
          style={textStyle}
          className="w-full resize-none bg-transparent font-[var(--font-hand)] text-base leading-snug text-stone-800 outline-none placeholder:text-stone-500 dark:text-stone-50 dark:placeholder:text-stone-300/70"
        />
      )}

      {note.kind === "drawing" && note.image && (
        <button
          onClick={() => setDrawOpen(true)}
          aria-label="Keep drawing"
          className="relative block h-40 w-full overflow-hidden rounded-lg"
        >
          <Image
            src={note.image}
            alt="Handwritten note"
            fill
            unoptimized
            className="object-contain"
          />
        </button>
      )}

      {note.kind === "checklist" && (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {note.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="group flex items-center gap-2"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-stone-700/40 transition dark:border-stone-200/50",
                    item.done && "border-stone-700 bg-stone-700 dark:border-stone-100 dark:bg-stone-100"
                  )}
                >
                  {item.done && (
                    <Check className="h-3.5 w-3.5 text-white dark:text-stone-900" />
                  )}
                </button>
                <span
                  style={textStyle}
                  className={cn(
                    "flex-1 font-[var(--font-hand)] text-base text-stone-800 dark:text-stone-50",
                    item.done && "text-stone-500 line-through dark:text-stone-400"
                  )}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove item"
                >
                  <X className="h-3.5 w-3.5 text-stone-600 hover:text-red-700 dark:text-stone-300 dark:hover:text-red-400" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-2 pt-1">
            <Plus className="h-4 w-4 shrink-0 text-stone-600 dark:text-stone-300" />
            <input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
              placeholder="Add item..."
              className="w-full bg-transparent font-[var(--font-hand)] text-base text-stone-800 outline-none placeholder:text-stone-500 dark:text-stone-50 dark:placeholder:text-stone-300/70"
            />
          </div>

          {totalItems > 0 && (
            <div className="pt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    allDone ? "bg-emerald-600" : "bg-stone-700/70 dark:bg-stone-200/70"
                  )}
                  animate={{ width: `${(doneItems / totalItems) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </div>
              {allDone && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 font-[var(--font-hand)] text-sm font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  All done! 🎉
                </motion.p>
              )}
            </div>
          )}
        </div>
      )}

      {note.kind === "drawing" && (
        <DrawPad
          open={drawOpen}
          onOpenChange={setDrawOpen}
          initialImage={note.image}
          onSave={(image) => onUpdate(note.id, { image })}
        />
      )}
    </motion.div>
  );
}
