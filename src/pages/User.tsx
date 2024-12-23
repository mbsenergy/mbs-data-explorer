import { UserProfileForm } from "@/components/user-profile/UserProfileForm";

const User = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <UserProfileForm />
    </div>
  );
};

export default User;