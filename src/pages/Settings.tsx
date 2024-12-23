import { PasswordSection } from "@/components/settings/PasswordSection";
import { ApiTokenSection } from "@/components/settings/ApiTokenSection";
import { ContactSection } from "@/components/settings/ContactSection";

const Settings = () => {
  return (
    <div className="space-y-8">
      <h1>Settings</h1>
      <PasswordSection />
      <ApiTokenSection />
      <ContactSection />
    </div>
  );
};

export default Settings;