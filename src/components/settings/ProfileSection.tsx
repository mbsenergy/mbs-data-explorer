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
import { SkillsAndSubscriptions } from "./profile/SkillsAndSubscriptions";
import { SubscriptionsCard } from "./profile/SubscriptionsCard";
import { TechStackCard } from "./profile/TechStackCard";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
  it_skills: string[] | null;
  subscriptions: string[] | null;
}

const getLevelColor = (level: string) => {
  const normalizedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  
  switch (normalizedLevel) {
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

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    placeholderData: {
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
      it_skills: [],
      subscriptions: [],
    },
  });

  const handleProfileChange = (field: keyof Profile, value: string | string[] | null) => {
    if (!profile) return;
    const updatedProfile = {
      ...profile,
      [field]: value,
    };
    setProfile(updatedProfile);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

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

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <CardContent className="p-8">
          <div className="text-center text-red-500">
            Error loading profile: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            No profile data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Level:</span>
            <Badge className={`${getLevelColor(profile.level)} border-none text-base`}>
              {profile.level.charAt(0).toUpperCase() + profile.level.slice(1).toLowerCase()}
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

          {isEditing && (
            <SkillsAndSubscriptions
              isEditing={isEditing}
              subscriptions={profile.subscriptions}
              itSkills={profile.it_skills}
              onSubscriptionsChange={(subscriptions) => 
                handleProfileChange("subscriptions", subscriptions)
              }
              onSkillsChange={(skills) => 
                handleProfileChange("it_skills", skills)
              }
            />
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SubscriptionsCard subscriptions={profile.subscriptions} />
              <TechStackCard skills={profile.it_skills} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};