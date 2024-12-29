import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";

export const useNotes = () => {
  const query = useQuery<Note[], Error>({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};