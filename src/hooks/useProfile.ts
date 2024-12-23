import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Profile {
  avatar_url: string;
  company: string;
  country: string;
  created_at: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  github_username: string;
  id: string;
  is_cerved: boolean;
  it_skills: string[];
  last_name: string;
  linkedin_url: string;
  preferred_data: string[];
  role: string;
  subscriptions: string[];
  updated_at: string;
}

export const useProfile = (userId: string | undefined, onProfileLoaded: (data: Profile) => void) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log("Fetching profile for user:", userId);
      if (!userId) throw new Error('No user ID available');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Fetched profile data:", data);
      return data as Profile;
    },
    enabled: !!userId,
    meta: {
      onSuccess: onProfileLoaded,
      onError: (error: Error) => {
        console.error("Error in profile query:", error);
        toast.error("Failed to load profile data");
      }
    }
  });
};