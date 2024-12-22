import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOsservatorioDocuments = () => {
  return useQuery({
    queryKey: ["osservatorio-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from('osservatorio-energia')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error("Error fetching osservatorio documents:", error);
        throw error;
      }

      return data.map(file => ({
        name: file.name,
        previewUrl: supabase.storage.from('osservatorio-energia').getPublicUrl(file.name).data.publicUrl,
        pdfUrl: supabase.storage.from('osservatorio-energia').getPublicUrl(file.name).data.publicUrl,
      }));
    },
  });
};