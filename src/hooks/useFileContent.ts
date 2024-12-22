import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFileContent = (path: string) => {
  return useQuery({
    queryKey: ["file-content", path],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("developer")
        .download(path);

      if (error) {
        console.error("Error fetching file content:", error);
        throw error;
      }

      const text = await data.text();
      return text;
    },
    enabled: !!path,
  });
};