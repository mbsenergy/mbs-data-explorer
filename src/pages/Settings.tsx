import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Key, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handlePasswordChange = () => {
    toast({
      title: "Coming Soon",
      description: "Password change functionality will be available soon.",
    });
  };

  const handleGenerateToken = () => {
    toast({
      title: "Coming Soon",
      description: "API token generation will be available soon.",
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you soon!",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5" />
            <h3 className="text-lg font-medium">Change Password</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input type="password" id="current" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input type="password" id="new" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input type="password" id="confirm" />
            </div>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" />
            <h3 className="text-lg font-medium">API Token</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate an API token to access our services programmatically.
            </p>
            <Button onClick={handleGenerateToken}>Generate New Token</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5" />
            <h3 className="text-lg font-medium">Contact Support</h3>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question..."
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;