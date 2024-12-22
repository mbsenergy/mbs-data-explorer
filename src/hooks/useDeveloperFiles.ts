import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDeveloperFiles = (section: string) => {
  return useQuery({
    queryKey: ["developer-files", section],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .storage
        .from('developer')
        .list(section, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      // Filter out .emptyFolderPlaceholder files
      const validFiles = files?.filter(file => !file.name.includes('.emptyFolderPlaceholder')) || [];

      return validFiles.map(file => {
        const nameParts = file.name.split('-');
        const field = nameParts[0];
        const extension = file.name.split('.').pop() || '';
        const title = file.name.substring(field.length + 1).replace(`.${extension}`, '');

        // Construct the full URL with the section path
        const publicUrl = supabase.storage
          .from('developer')
          .getPublicUrl(`${section}/${file.name}`).data.publicUrl;

        return {
          name: file.name,
          url: publicUrl,
          field,
          extension,
          title
        };
      });
    },
  });
};