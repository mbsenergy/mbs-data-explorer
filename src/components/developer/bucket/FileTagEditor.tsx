import { useState } from "react";
import { TagInput } from "@/components/datasets/query-tags/TagInput";
import { TagBadge } from "@/components/datasets/query-tags/TagBadge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileTagEditorProps {
  fileId: string;
  initialTags: string[];
  onTagsUpdate: (newTags: string[]) => void;
}

export const FileTagEditor = ({ fileId, initialTags, onTagsUpdate }: FileTagEditorProps) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    const updatedTags = [...tags, newTag.trim()];
    try {
      const { error } = await supabase
        .from('storage_files')
        .update({ tags: updatedTags })
        .eq('id', fileId);

      if (error) throw error;

      setTags(updatedTags);
      onTagsUpdate(updatedTags);
      setNewTag("");
      
      toast({
        description: "Tag added successfully",
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        variant: "destructive",
        description: "Failed to add tag",
      });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    try {
      const { error } = await supabase
        .from('storage_files')
        .update({ tags: updatedTags })
        .eq('id', fileId);

      if (error) throw error;

      setTags(updatedTags);
      onTagsUpdate(updatedTags);
      
      toast({
        description: "Tag removed successfully",
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        variant: "destructive",
        description: "Failed to remove tag",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            onRemove={() => handleRemoveTag(tag)}
          />
        ))}
      </div>
      <TagInput
        value={newTag}
        onChange={setNewTag}
        onAdd={handleAddTag}
      />
    </div>
  );
};