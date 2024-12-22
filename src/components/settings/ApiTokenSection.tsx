import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from "uuid";

export const ApiTokenSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tokenName, setTokenName] = useState("");

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
        className: "bg-primary text-primary-foreground",
      });

      // Show token to user
      toast({
        title: "Your API Token",
        description: token,
        duration: 10000,
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

  return (
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
  );
};