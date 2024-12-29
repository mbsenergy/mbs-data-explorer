import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";

export const useNotes = () => {
  return useQuery({
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
};