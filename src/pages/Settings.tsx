import { ApiTokenSection } from "@/components/settings/ApiTokenSection";
import { ContactSection } from "@/components/settings/ContactSection";
import { PasswordSection } from "@/components/settings/PasswordSection";

const Settings = () => {
  return (
    <div className="space-y-8">
      <h1>Settings</h1>
      <ApiTokenSection />
      <PasswordSection />
      <ContactSection />
    </div>
  );
};

export default Settings;