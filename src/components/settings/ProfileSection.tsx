import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AvatarSection } from "./profile/AvatarSection";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { ProfessionalInfoSection } from "./profile/ProfessionalInfoSection";
import { Badge } from "@/components/ui/badge";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  role: string | null;
  date_of_birth: string | null;
  country: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  level: string;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Premium':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
    case 'Plus':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600';
    default:
      return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600';
  }
};

export const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    company: "",
    role: "",
    date_of_birth: null,
    country: "",
    github_url: "",
    linkedin_url: "",
    avatar_url: "",
    level: "Basic",
  });

  const { refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
      
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const handleProfileChange = (field: string, value: string | null) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    const updatedProfile = {
      ...profile,
      date_of_birth: profile.date_of_birth || null,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsEditing(false);
    refetch();
    toast({
      title: "Profile updated successfully",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Level:</span>
            <Badge className={`${getLevelColor(profile.level)} border-none text-base`}>
              {profile.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <AvatarSection
              avatarUrl={profile.avatar_url}
              firstName={profile.first_name}
              lastName={profile.last_name}
              onAvatarUpdate={refetch}
            />

            <div className="flex-1">
              <h3 className="text-2xl font-semibold">
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          <PersonalInfoSection
            isEditing={isEditing}
            profile={profile}
            onProfileChange={handleProfileChange}
          />

          <ProfessionalInfoSection
            isEditing={isEditing}
            profile={profile}
            onProfileChange={handleProfileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};