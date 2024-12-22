import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                className="max-w-md"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;