import { PasswordSection } from "@/components/settings/PasswordSection";
import { ApiTokenSection } from "@/components/settings/ApiTokenSection";
import { ContactSection } from "@/components/settings/ContactSection";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6">
        <PasswordSection />
        <ApiTokenSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Settings;