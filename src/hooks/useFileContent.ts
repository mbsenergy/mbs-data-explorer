import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFileContent = (path: string) => {
  return useQuery({
    queryKey: ["file-content", path],
    queryFn: async () => {
      try {
        console.log('Fetching file:', path);
        
        // Split the path to get the section and filename
        const pathParts = path.split('/');
        const section = pathParts[0];
        const filename = pathParts[1];
        
        const { data, error } = await supabase.storage
          .from("developer")
          .download(`${section}/${filename}`);

        if (error) {
          console.error("Error fetching file content:", error);
          throw error;
        }

        if (!data) {
          throw new Error("No data received from storage");
        }

        const text = await data.text();
        return text;
      } catch (error) {
        console.error("Failed to fetch file content:", error);
        throw error;
      }
    },
    enabled: !!path,
    retry: false,
  });
};