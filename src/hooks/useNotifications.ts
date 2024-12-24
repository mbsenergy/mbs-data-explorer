import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = (lastCheck: number) => {
  return useQuery({
    queryKey: ["notifications", lastCheck],
    queryFn: async () => {
      try {
        const buckets = ['latest', 'report-scenario', 'osservatorio-energia'];
        const allFiles = await Promise.allSettled(
          buckets.map(async (bucket) => {
          const { data, error } = await supabase
            .storage
            .from(bucket)
            .list('', {
              limit: 10,
              sortBy: { column: 'created_at', order: 'desc' },
            });

          if (error) {
            return { status: 'fulfilled', value: [] };
          }

          return data.map(file => ({
            ...file,
            bucket,
          }));
          })
        );

        return allFiles
          .filter((result): result is PromiseFulfilledResult<any[]> => 
            result.status === 'fulfilled')
          .map(result => result.value)
          .flat()
          .sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
};