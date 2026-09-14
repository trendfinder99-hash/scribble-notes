import { NoteColor } from "@/types";

export const NOTE_COLORS: Record<
  NoteColor,
  { bg: string; tape: string; ring: string; label: string; dark: string; darkTape: string }
> = {
  sunshine: {
    bg: "#FFE988",
    tape: "#FFD65C",
    ring: "#F2C230",
    label: "Sunshine",
    dark: "#7A6410",
    darkTape: "#9C8318",
  },
  bubblegum: {
    bg: "#FFC1D9",
    tape: "#FF9CC0",
    ring: "#F5729F",
    label: "Bubblegum",
    dark: "#7A2049",
    darkTape: "#9C2C5D",
  },
  sky: {
    bg: "#AEE3FF",
    tape: "#8AD3FF",
    ring: "#4FB4EE",
    label: "Sky",
    dark: "#0E4A6B",
    darkTape: "#145E86",
  },
  mint: {
    bg: "#B7F5CE",
    tape: "#93EBB4",
    ring: "#4FD182",
    label: "Mint",
    dark: "#0F5C36",
    darkTape: "#157245",
  },
  peach: {
    bg: "#FFCBA0",
    tape: "#FFB37A",
    ring: "#F6903D",
    label: "Peach",
    dark: "#7A3D0E",
    darkTape: "#9C4F14",
  },
  lilac: {
    bg: "#E0C8FF",
    tape: "#D2AEFF",
    ring: "#B27CF0",
    label: "Lilac",
    dark: "#4B2578",
    darkTape: "#5E3096",
  },
};

export const NOTE_COLOR_ORDER: NoteColor[] = [
  "sunshine",
  "bubblegum",
  "sky",
  "mint",
  "peach",
  "lilac",
];

export function nextColor(color: NoteColor): NoteColor {
  const idx = NOTE_COLOR_ORDER.indexOf(color);
  return NOTE_COLOR_ORDER[(idx + 1) % NOTE_COLOR_ORDER.length];
}

export function randomColor(): NoteColor {
  return NOTE_COLOR_ORDER[Math.floor(Math.random() * NOTE_COLOR_ORDER.length)];
}

export const INK_COLORS: string[] = [
  "#1C1C1E",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#FFFFFF",
];

export const DEFAULT_INK_COLOR = "#1C1C1E";
