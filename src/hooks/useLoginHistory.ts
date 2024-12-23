import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLoginHistory = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["login-history", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log("Fetching login history for user:", userId);
      const { data, error } = await supabase
        .from("user_logins")
        .select("*")
        .eq("user_id", userId)
        .order("logged_in_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching login history:", error);
        throw error;
      }

      console.log("Login history fetch result:", data);
      return data;
    },
    enabled: !!userId,
  });
};