import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Profile {
  avatar_url: string | null;
  company: string | null;
  country: string | null;
  created_at: string;
  date_of_birth: string | null;
  email: string | null;
  first_name: string | null;
  github_username: string | null;
  id: string;
  is_cerved: boolean | null;
  it_skills: string[] | null;
  last_name: string | null;
  linkedin_url: string | null;
  preferred_data: string[] | null;
  role: string | null;
  subscriptions: string[] | null;
  updated_at: string;
}

export const useProfile = (userId: string | undefined, onProfileLoaded?: (data: Profile) => void) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log("Fetching profile for user:", userId);
      if (!userId) throw new Error('No user ID available');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Fetched profile data:", data);
      return data as Profile | null;
    },
    enabled: !!userId,
    gcTime: 1000 * 60 * 30, // 30 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    meta: {
      onSuccess: (data: Profile | null) => {
        console.log("Profile query succeeded:", data);
        if (onProfileLoaded && data) {
          onProfileLoaded(data);
        }
      },
      onError: (error: Error) => {
        console.error("Error in profile query:", error);
        toast.error("Failed to load profile data");
      }
    }
  });
};