export type NoteColor =
  | "sunshine"
  | "bubblegum"
  | "sky"
  | "mint"
  | "peach"
  | "lilac";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type NoteKind = "text" | "checklist" | "drawing";

export interface Note {
  id: string;
  kind: NoteKind;
  title: string;
  body: string;
  items: ChecklistItem[];
  image?: string;
  textColor?: string;
  color: NoteColor;
  rotation: number;
  createdAt: number;
}
