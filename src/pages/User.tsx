import { MainInfoSection } from "@/components/user/MainInfoSection";
import { ITSkillsSection } from "@/components/user/ITSkillsSection";
import { PreferredDataSection } from "@/components/user/PreferredDataSection";
import { SubscriptionsSection } from "@/components/user/SubscriptionsSection";

const User = () => {
  return (
    <div className="space-y-8">
      <h1>User Profile</h1>
      <MainInfoSection />
      <ITSkillsSection />
      <PreferredDataSection />
      <SubscriptionsSection />
    </div>
  );
};

export default User;