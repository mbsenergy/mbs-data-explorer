import { ApiTokenSection } from "@/components/settings/ApiTokenSection";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">Settings</h1>
      
      <div className="grid gap-6">
        <ApiTokenSection />
      </div>
    </div>
  );
};

export default Settings;