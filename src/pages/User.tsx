import { PasswordSection } from "@/components/settings/PasswordSection";
import { ContactSection } from "@/components/settings/ContactSection";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SubscriptionsCard } from "@/components/settings/profile/SubscriptionsCard";
import { TechStackCard } from "@/components/settings/profile/TechStackCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const User = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("subscriptions, it_skills")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">
        User Profile
      </h1>
      
      <div className="grid gap-6">
        <ProfileSection />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubscriptionsCard subscriptions={profile?.subscriptions} />
          <TechStackCard skills={profile?.it_skills} />
        </div>
        <PasswordSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default User;