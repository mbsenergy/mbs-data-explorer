import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileForm } from "./ProfileForm";

export const UserProfileForm = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
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
            onAvatarUpdate={() => {
              // Profile will be automatically updated through AuthProvider
            }}
          />
          <ProfileForm 
            profile={profile} 
            onProfileUpdate={() => {
              // Profile will be automatically updated through AuthProvider
            }}
            userId={user?.id || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
};