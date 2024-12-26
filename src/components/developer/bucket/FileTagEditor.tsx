import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileTagEditorProps {
  fileId: string;
  initialTags: string[];
  onTagsUpdate: (newTags: string[]) => void;
}

export const FileTagEditor = ({ fileId, initialTags, onTagsUpdate }: FileTagEditorProps) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
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
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tags",
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
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove tag",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button
          onClick={handleAddTag}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
};