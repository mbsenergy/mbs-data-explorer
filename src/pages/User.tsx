import { UserProfileForm } from "@/components/user-profile/UserProfileForm";
import { LoginHistory } from "@/components/user-profile/LoginHistory";
import { UserProfileTable } from "@/components/user-profile/UserProfileTable";

const User = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <UserProfileForm />
      <UserProfileTable />
      <LoginHistory />
    </div>
  );
};

export default User;