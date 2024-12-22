import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Key, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully!",
        className: "bg-primary text-white",
      });

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateToken = async () => {
    if (!tokenName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your token.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = uuidv4();
      const { error } = await supabase
        .from('api_tokens')
        .insert([
          {
            user_id: user?.id,
            token,
            name: tokenName,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API token generated successfully!",
        className: "bg-primary text-white",
      });

      // Show token to user
      toast({
        title: "Your API Token",
        description: token,
        duration: 10000, // Show for 10 seconds
      });

      setTokenName("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.functions.invoke('send-support-email', {
        body: {
          from: user?.email,
          to: ["support@example.com"],
          subject: subject,
          html: `
            <p><strong>From:</strong> ${user?.email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully!",
        className: "bg-primary text-white",
      });

      // Clear form
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6">
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5" />
            <h3 className="text-lg font-medium">Change Password</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input 
                type="password" 
                id="current"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input 
                type="password" 
                id="new"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input 
                type="password" 
                id="confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </Card>

        <Card className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" />
            <h3 className="text-lg font-medium">API Token</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate an API token to access our services programmatically.
            </p>
            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name</Label>
              <Input 
                id="tokenName"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="e.g., Development Token"
              />
            </div>
            <Button onClick={handleGenerateToken}>Generate New Token</Button>
          </div>
        </Card>

        <Card className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5" />
            <h3 className="text-lg font-medium">Contact Support</h3>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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