import { useAuth } from "@/components/auth/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileForm } from "./ProfileForm";

export const UserProfileForm = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, refetch } = useProfile(user?.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AvatarUpload 
            avatarUrl={profile?.avatar_url} 
            onAvatarUpdate={refetch}
          />
          <ProfileForm 
            profile={profile} 
            onProfileUpdate={refetch} 
            userId={user?.id || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
};