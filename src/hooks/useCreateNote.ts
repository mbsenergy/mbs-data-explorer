import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (noteData: CreateNoteData) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ ...noteData }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create note. Please try again.",
      });
    },
  });

  return {
    createNote: mutation.mutate,
    isCreating: mutation.isPending,
  };
};