import { Button } from "@/components/ui/button";
import { Note } from "@/types/notes";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

interface NotePreviewProps {
  note: Note;
  onClose: () => void;
}

export const NotePreview = ({ note, onClose }: NotePreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="prose prose-invert max-w-none">
        <h1>{note.title}</h1>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};