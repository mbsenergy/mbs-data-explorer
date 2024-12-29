import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/notes";
import ReactMarkdown from "react-markdown";

interface NotePreviewProps {
  note: Note;
  onClose: () => void;
}

export const NotePreview = ({ note, onClose }: NotePreviewProps) => {
  return (
    <Card className="p-4 space-y-4 metallic-card">
      <div className="prose prose-invert max-w-none">
        <h1>{note.title}</h1>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Card>
  );
};