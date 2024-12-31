import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote } from "@/hooks/useCreateNote";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import { Note } from "@/types/notes";
import { TagInput } from "@/components/datasets/query-tags/TagInput";

interface NoteEditorProps {
  mode: "create" | "edit";
  note?: Note;
  onClose: () => void;
}

export const NoteEditor = ({ mode, note, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  
  const { createNote, isCreating } = useCreateNote();
  const { updateNote, isUpdating } = useUpdateNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const noteData = {
      title,
      content,
      tags // Ensure tags are included in the data
    };
    
    if (mode === "create") {
      await createNote(noteData);
    } else if (note) {
      await updateNote({ id: note.id, ...noteData });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Write your note in markdown..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="min-h-[200px] font-mono"
      />
      <TagInput
        tags={tags}
        onTagsChange={setTags}
        placeholder="Add tags..."
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};