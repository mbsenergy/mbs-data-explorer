import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MainInfoSection } from "@/components/user/MainInfoSection";
import { ITSkillsSection } from "@/components/user/ITSkillsSection";
import { PreferredDataSection } from "@/components/user/PreferredDataSection";
import { SubscriptionsSection } from "@/components/user/SubscriptionsSection";

const User = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    date_of_birth: profile?.date_of_birth || "",
    country: profile?.country || "",
    company: profile?.company || "",
    role: profile?.role || "",
    linkedin_url: profile?.linkedin_url || "",
    github_username: profile?.github_username || "",
    it_skills: profile?.it_skills || [],
    preferred_data: profile?.preferred_data || [],
    subscriptions: profile?.subscriptions || [],
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUpdating(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      await refetch();
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckboxChange = (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <MainInfoSection
          profile={profile}
          user={user}
          formData={formData}
          setFormData={setFormData}
          handleImageUpload={handleImageUpload}
          handleLogout={handleLogout}
        />

        <ITSkillsSection
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
        />

        <PreferredDataSection
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
        />

        <SubscriptionsSection
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
        />

        <Button type="submit" disabled={isUpdating}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default User;