import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainInfoSection } from "@/components/user/MainInfoSection";
import { ITSkillsSection } from "@/components/user/ITSkillsSection";
import { PreferredDataSection } from "@/components/user/PreferredDataSection";
import { SubscriptionsSection } from "@/components/user/SubscriptionsSection";
import { toast } from "sonner";

const User = () => {
  const { user } = useAuth();
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

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    meta: {
      onSettled: (data: any) => {
        if (data) {
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
        }
      }
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
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

  return (
    <div className="space-y-8">
      <h1>User Profile</h1>
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
    </div>
  );
};

export default User;