"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit } from "lucide-react";
import { Note } from "@/types";
import { loadNotes, saveNotes, makeId, randomRotation } from "@/lib/notes-storage";
import { randomColor } from "@/lib/colors";
import { NoteCard } from "@/components/note-card";
import { NoteComposer } from "@/components/note-composer";
import { ThemeToggle } from "@/components/theme-toggle";
import { InstallButton } from "@/components/install-button";

export function NotesBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const notesRef = useRef<Note[]>([]);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  notesRef.current = notes;

  useEffect(() => {
    setNotes(loadNotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveNotes(notes);
  }, [notes, hydrated]);

  function createNote(kind: "text" | "checklist") {
    const note: Note = {
      id: makeId(),
      kind,
      title: "",
      body: "",
      items: [],
      color: randomColor(),
      rotation: randomRotation(),
      createdAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
  }

  function createDrawingNote(image: string) {
    const note: Note = {
      id: makeId(),
      kind: "drawing",
      title: "",
      body: "",
      items: [],
      image,
      color: randomColor(),
      rotation: randomRotation(),
      createdAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
  }

  function updateNote(id: string, updates: Partial<Note>) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function registerCardRef(id: string, el: HTMLDivElement | null) {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function reorderTo(overId: string) {
    const dragged = draggedId;
    if (!dragged || dragged === overId) return;
    const current = notesRef.current;
    const fromIndex = current.findIndex((n) => n.id === dragged);
    const toIndex = current.findIndex((n) => n.id === overId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setNotes(next);
  }

  function handleDragMove(clientX: number, clientY: number) {
    if (!draggedId) return;
    for (const [id, el] of cardRefs.current.entries()) {
      if (id === draggedId) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        reorderTo(id);
        break;
      }
    }
  }

  function handleDragEnd() {
    setDraggedId(null);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <header className="relative mb-8 text-center">
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <InstallButton />
          <ThemeToggle />
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <Edit className="h-7 w-7 text-stone-700 dark:text-stone-200" />
          <h1 className="font-[var(--font-hand)] text-4xl font-bold text-stone-800 dark:text-stone-50 sm:text-5xl">
            Scribble Notes
          </h1>
        </div>
        <p className="font-[var(--font-hand)] text-lg text-stone-600 dark:text-stone-300">
          Your colorful corner for notes &amp; to-dos
        </p>
      </header>

      <NoteComposer onCreate={createNote} onCreateDrawing={createDrawingNote} />

      {hydrated && notes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-16 max-w-sm text-center"
        >
          <p className="font-[var(--font-hand)] text-xl text-stone-500 dark:text-stone-400">
            Nothing here yet — add your first note above! ✨
          </p>
        </motion.div>
      )}

      {hydrated && notes.length > 0 && (
        <p className="mb-4 text-center font-[var(--font-hand)] text-sm text-stone-500 dark:text-stone-400">
          Drag the ⋮⋮ handle on a note to arrange them in any order.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              isDragging={draggedId === note.id}
              onDragStart={() => handleDragStart(note.id)}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              registerRef={(el) => registerCardRef(note.id, el)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
