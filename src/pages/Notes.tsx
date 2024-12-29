import { useState } from "react";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeveloperSearch } from "@/components/developer/DeveloperSearch";
import { Note } from "@/types/notes";

const Notes = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const { toast } = useToast();
  const { notes, isLoading, error } = useNotes();

  // Get unique tags from all notes
  const availableTags = Array.from(
    new Set(notes?.flatMap((note) => note.tags || []) || [])
  );

  // Filter notes based on search criteria
  const filteredNotes = notes?.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || note.tags?.includes(selectedTag);
    // For now, we'll skip favorites since it's not implemented yet
    // You can add a 'is_favorite' field to the notes table later
    return matchesSearch && matchesTag;
  });

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

      <DeveloperSearch
        title="Search Notes"
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        onFavoriteChange={setShowFavorites}
        availableTags={availableTags}
      />

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl">
          <NoteEditor
            mode="create"
            onClose={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      <NotesList isLoading={isLoading} notes={filteredNotes} />
    </div>
  );
};

export default Notes;