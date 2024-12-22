import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = (lastCheck: number) => {
  return useQuery({
    queryKey: ["notifications", lastCheck],
    queryFn: async () => {
      const buckets = ['latest', 'report-scenario', 'osservatorio-energia'];
      const allFiles = await Promise.all(
        buckets.map(async (bucket) => {
          const { data, error } = await supabase
            .storage
            .from(bucket)
            .list('', {
              limit: 10,
              sortBy: { column: 'created_at', order: 'desc' },
            });

          if (error) {
            console.error(`Error fetching from ${bucket}:`, error);
            return [];
          }

          return data.map(file => ({
            ...file,
            bucket,
          }));
        })
      );

      return allFiles
        .flat()
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
};