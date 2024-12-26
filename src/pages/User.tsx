import { PasswordSection } from "@/components/settings/PasswordSection";
import { ContactSection } from "@/components/settings/ContactSection";

const User = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">User Profile</h1>
      
      <div className="grid gap-6">
        <PasswordSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default User;