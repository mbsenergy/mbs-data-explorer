import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Note } from "@/types/notes";

interface UpdateNoteData {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  is_favorite?: boolean;
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (noteData: UpdateNoteData) => {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags || [], // Ensure tags is always an array
          is_favorite: noteData.is_favorite,
          updated_at: new Date().toISOString()
        })
        .eq("id", noteData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update note. Please try again.",
      });
    },
  });

  return {
    updateNote: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};