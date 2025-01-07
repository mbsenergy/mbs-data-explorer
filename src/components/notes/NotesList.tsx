import { useNotes } from "@/hooks/useNotes";
import { NoteCard } from "./NoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Note } from "@/types/notes";

interface NotesListProps {
  isLoading: boolean;
  notes?: Note[];
}

export const NotesList = ({ isLoading, notes }: NotesListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No notes found. Create your first note!
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};