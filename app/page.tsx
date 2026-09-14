import { NotesBoard } from "@/components/notes-board";

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-[#FBF3E3] [background-size:22px_22px] [background-image:radial-gradient(circle,rgba(60,40,10,0.08)_1px,transparent_1px)] transition-colors duration-300 dark:bg-[#151417] dark:[background-image:radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)]"
    >
      <NotesBoard />
    </main>
  );
}
