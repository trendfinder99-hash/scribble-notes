import { Note } from "@/types";

const STORAGE_KEY = "colorful-notes:v1";

export function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Note[];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors (e.g. quota, private browsing)
  }
}

export function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function randomRotation(): number {
  const options = [-4, -3, -2, -1.5, 1.5, 2, 3, 4];
  return options[Math.floor(Math.random() * options.length)];
}
