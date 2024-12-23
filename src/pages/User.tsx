import { UserProfileForm } from "@/components/user-profile/UserProfileForm";
import { LoginHistory } from "@/components/user-profile/LoginHistory";

const User = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <UserProfileForm />
      <LoginHistory />
    </div>
  );
};

export default User;