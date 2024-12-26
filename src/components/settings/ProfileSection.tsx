import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Globe, Calendar, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
}

export const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    company: "",
    role: "",
    date_of_birth: "",
    country: "",
    github_url: "",
    linkedin_url: "",
    avatar_url: "",
  });

  const { data: profileData, refetch } = useQuery({
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
    meta: {
      onSuccess: (data: Profile) => {
        setProfile(data);
      },
    },
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error uploading avatar",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      toast({
        title: "Error updating profile",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    refetch();
    toast({
      title: "Avatar updated successfully",
      description: "Your profile picture has been updated.",
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(profile)
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

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.first_name, profile.last_name)}
                </AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleAvatarUpload}
              />
              <Label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 rounded-full bg-primary p-1 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </Label>
            </div>

            <div className="flex-1 space-y-1">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name || ""}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name || ""}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <h3 className="text-2xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h3>
              )}
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

          {/* Professional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company || ""}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </>
                ) : (
                  <span>{profile.company || "Add company"}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.date_of_birth || ""}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                    />
                  </>
                ) : (
                  <span>{profile.date_of_birth || "Add date of birth"}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profile.country || ""}
                      onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    />
                  </>
                ) : (
                  <span>{profile.country || "Add country"}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role || ""}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    />
                  </>
                ) : (
                  <span>{profile.role || "Add role"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  placeholder="GitHub Profile URL"
                  value={profile.github_url || ""}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                />
              ) : (
                <a
                  href={profile.github_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.github_url || "Add GitHub profile"}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  placeholder="LinkedIn Profile URL"
                  value={profile.linkedin_url || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                />
              ) : (
                <a
                  href={profile.linkedin_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.linkedin_url || "Add LinkedIn profile"}
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};