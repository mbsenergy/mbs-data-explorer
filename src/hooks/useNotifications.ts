import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [clearTimestamp, setClearTimestamp] = useState<number | null>(null);

  // Fetch notifications
  const { data, error } = useQuery({
    queryKey: ["notifications"],
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

  // Fetch user's notification preferences
  const { data: preferences } = useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error fetching preferences:", error);
      }
      return data;
    },
  });

  // Update clear timestamp in the database
  const updateClearTimestamp = useMutation({
    mutationFn: async (timestamp: number) => {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          last_cleared_at: new Date(timestamp).toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences"] });
    },
  });

  // Initialize clearTimestamp from preferences
  useEffect(() => {
    if (preferences?.last_cleared_at) {
      setClearTimestamp(new Date(preferences.last_cleared_at).getTime());
    }
  }, [preferences]);

  // Handle setting new clear timestamp
  const handleSetClearTimestamp = (timestamp: number) => {
    setClearTimestamp(timestamp);
    updateClearTimestamp.mutate(timestamp);
  };

  return {
    data,
    error,
    clearTimestamp,
    setClearTimestamp: handleSetClearTimestamp,
  };
};