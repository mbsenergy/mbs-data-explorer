import { useState } from "react";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeveloperSearch } from "@/components/developer/DeveloperSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowEditor } from "@/components/notes/FlowEditor";

const Notes = () => {
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
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
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || (note.tags && note.tags.includes(selectedTag));
    const matchesFavorite = !showFavorites || note.is_favorite;
    
    return matchesSearch && matchesTag && matchesFavorite;
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
          Notes & Flows
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreatingNote(true)}
            className="bg-corporate-teal hover:bg-corporate-teal/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
          <Button
            onClick={() => setIsCreatingFlow(true)}
            className="bg-corporate-teal hover:bg-corporate-teal/90"
          >
            <Share2 className="h-4 w-4 mr-2" />
            New Flow
          </Button>
        </div>
      </div>

      <DeveloperSearch
        title="Search Notes & Flows"
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        onFavoriteChange={setShowFavorites}
        availableTags={availableTags}
      />

      <Dialog open={isCreatingNote} onOpenChange={setIsCreatingNote}>
        <DialogContent className="max-w-4xl">
          <NoteEditor
            mode="create"
            onClose={() => setIsCreatingNote(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingFlow} onOpenChange={setIsCreatingFlow}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <FlowEditor
            onClose={() => setIsCreatingFlow(false)}
          />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <NotesList isLoading={isLoading} notes={filteredNotes} />
        </TabsContent>
        <TabsContent value="flows">
          <div className="text-center py-10 text-muted-foreground">
            Select your flows or create a new one
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notes;