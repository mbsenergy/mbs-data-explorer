import { useState } from "react";
import { TagInput } from "./TagInput";
import { TagBadge } from "./TagBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TagEditorProps {
  queryId: string;
  tags: string[];
  onUpdate: () => Promise<void>;
}

export const TagEditor = ({ queryId, tags, onUpdate }: TagEditorProps) => {
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const updatedTags = [...tags, newTag.trim()];
      
      const { error } = await supabase
        .from("saved_queries")
        .update({ tags: updatedTags })
        .eq("id", queryId);

      if (error) throw error;

      setNewTag("");
      await onUpdate();
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tag",
      });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    try {
      const updatedTags = tags.filter(tag => tag !== tagToRemove);
      
      const { error } = await supabase
        .from("saved_queries")
        .update({ tags: updatedTags })
        .eq("id", queryId);

      if (error) throw error;

      await onUpdate();
      
      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove tag",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          onRemove={handleRemoveTag}
        />
      ))}
      <TagInput
        value={newTag}
        onChange={setNewTag}
        onAdd={handleAddTag}
      />
    </div>
  );
};