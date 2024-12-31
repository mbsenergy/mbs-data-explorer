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
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching preferences:", error);
        return null;
      }

      // If no preferences exist, create them
      if (!data) {
        const { data: newPrefs, error: createError } = await supabase
          .from('notification_preferences')
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) {
          console.error("Error creating preferences:", createError);
          return null;
        }

        return newPrefs;
      }

      return data;
    },
  });

  // Update clear timestamp in the database
  const updateClearTimestamp = useMutation({
    mutationFn: async (timestamp: number) => {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from('notification_preferences')
        .update({ last_cleared_at: new Date(timestamp).toISOString() })
        .eq('user_id', userId);

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