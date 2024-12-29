import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { NoteEditor } from "./NoteEditor";
import { NotePreview } from "./NotePreview";
import { useDeleteNote } from "@/hooks/useDeleteNote";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/types/notes";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { deleteNote, isDeleting } = useDeleteNote();

  const handleExport = () => {
    const blob = new Blob([note.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="p-4 space-y-4 metallic-card">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{note.title}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(note.created_at), "PPP")}
          </p>
          <div className="flex flex-wrap gap-2">
            {note.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewing(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteNote(note.id)}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl">
          <NoteEditor
            mode="edit"
            note={note}
            onClose={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewing} onOpenChange={setIsPreviewing}>
        <DialogContent className="max-w-4xl">
          <NotePreview
            note={note}
            onClose={() => setIsPreviewing(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};