import { useState } from "react";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { notes, isLoading, error } = useNotes();

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load notes. Please try again.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
          Notes
        </h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-corporate-teal hover:bg-corporate-teal/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {isCreating && (
        <NoteEditor
          mode="create"
          onClose={() => setIsCreating(false)}
        />
      )}

      <NotesList isLoading={isLoading} />
    </div>
  );
};

export default Notes;