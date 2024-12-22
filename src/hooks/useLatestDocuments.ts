import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLatestDocuments = () => {
  return useQuery({
    queryKey: ["latest-docs"],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .storage
        .from('latest')
        .list('', {
          limit: 10,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      // Filter for PNG files (PDF previews)
      const pngFiles = files?.filter(file => file.name.toLowerCase().endsWith('.png')) || [];
      
      // For each PNG, check if there's a corresponding PDF
      const filesWithPdfs = await Promise.all(pngFiles.map(async (pngFile) => {
        const pdfName = pngFile.name.replace('.png', '.pdf');
        const { data: pdfExists } = await supabase
          .storage
          .from('latest')
          .list('', {
            search: pdfName
          });
        
        if (pdfExists?.length) {
          return {
            ...pngFile,
            pdfUrl: supabase.storage.from('latest').getPublicUrl(pdfName).data.publicUrl,
            previewUrl: supabase.storage.from('latest').getPublicUrl(pngFile.name).data.publicUrl
          };
        }
        return null;
      }));

      return filesWithPdfs.filter(Boolean);
    },
  });
};