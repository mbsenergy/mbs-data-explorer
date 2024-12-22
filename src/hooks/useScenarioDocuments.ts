import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useScenarioDocuments = () => {
  return useQuery({
    queryKey: ["scenario-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from('report-scenario')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error("Error fetching scenario documents:", error);
        throw error;
      }

      return data.map(file => ({
        name: file.name,
        previewUrl: supabase.storage.from('report-scenario').getPublicUrl(file.name).data.publicUrl,
        pdfUrl: supabase.storage.from('report-scenario').getPublicUrl(file.name).data.publicUrl,
      }));
    },
  });
};