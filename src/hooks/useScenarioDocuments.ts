import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useScenarioDocuments = () => {
  return useQuery({
    queryKey: ["scenario-documents"],
    queryFn: async () => {
      const { data: files, error } = await supabase
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

      // Filter for PNG files (PDF previews)
      const pngFiles = files?.filter(file => file.name.toLowerCase().endsWith('.png')) || [];
      
      // For each PNG, check if there's a corresponding PDF
      const filesWithPdfs = await Promise.all(pngFiles.map(async (pngFile) => {
        const pdfName = pngFile.name.replace('.png', '.pdf');
        const { data: pdfExists } = await supabase
          .storage
          .from('report-scenario')
          .list('', {
            search: pdfName
          });
        
        if (pdfExists?.length) {
          return {
            name: pngFile.name,
            previewUrl: supabase.storage.from('report-scenario').getPublicUrl(pngFile.name).data.publicUrl,
            pdfUrl: supabase.storage.from('report-scenario').getPublicUrl(pdfName).data.publicUrl
          };
        }
        return null;
      }));

      return filesWithPdfs.filter(Boolean);
    },
  });
};