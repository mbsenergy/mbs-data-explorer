import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { UserLevel } from "@/components/datasets/types";

export const useFeatureAccess = (featureName: string) => {
  const { user } = useAuth();

  const { data: isEnabled, isLoading } = useQuery({
    queryKey: ["feature-access", featureName, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase.rpc('check_feature_access', {
        feature_name: featureName,
        user_id: user.id
      });

      if (error) {
        console.error("Error checking feature access:", error);
        return false;
      }

      return data || false;
    },
    enabled: !!user?.id,
  });

  return {
    isEnabled: !!isEnabled,
    isLoading
  };
};