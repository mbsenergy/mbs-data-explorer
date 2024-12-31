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
  const { toast } = useToast();

  const handleTagsChange = async (newTags: string[]) => {
    try {
      const { error } = await supabase
        .from("saved_queries")
        .update({ tags: newTags })
        .eq("id", queryId);

      if (error) throw error;

      await onUpdate();
      
      toast({
        title: "Success",
        description: "Tags updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating tags:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tags",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <TagInput
        tags={tags}
        onTagsChange={handleTagsChange}
        placeholder="Add tags..."
      />
    </div>
  );
};