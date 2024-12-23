import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MainInfoSection } from "@/components/user/MainInfoSection";
import { ITSkillsSection } from "@/components/user/ITSkillsSection";
import { PreferredDataSection } from "@/components/user/PreferredDataSection";
import { SubscriptionsSection } from "@/components/user/SubscriptionsSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/hooks/useProfile";

const User = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    country: '',
    company: '',
    role: '',
    it_skills: [] as string[],
    preferred_data: [] as string[],
    subscriptions: [] as string[],
  });

  const handleProfileLoaded = (data: Profile) => {
    console.log("Setting form data with profile:", data);
    setFormData({
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      date_of_birth: data.date_of_birth || '',
      country: data.country || '',
      company: data.company || '',
      role: data.role || '',
      it_skills: data.it_skills || [],
      preferred_data: data.preferred_data || [],
      subscriptions: data.subscriptions || [],
    });
  };

  const { data: profile, isLoading, error } = useProfile(user?.id, handleProfileLoaded);

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      if (!user?.id) throw new Error('No user ID available');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          country: formData.country,
          company: formData.company,
          role: formData.role,
          it_skills: formData.it_skills,
          preferred_data: formData.preferred_data,
          subscriptions: formData.subscriptions,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (user?.id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }
      
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out');
    }
  };

  const handleCheckboxChange = (field: 'it_skills' | 'preferred_data' | 'subscriptions', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl text-red-500">Failed to load profile</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <MainInfoSection 
        profile={profile}
        user={user}
        formData={formData}
        setFormData={setFormData}
        handleImageUpload={handleImageUpload}
        handleLogout={handleLogout}
        handleSave={saveProfile}
        isSaving={isSaving}
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
    </div>
  );
};

export default User;