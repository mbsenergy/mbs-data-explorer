import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';

export const ApiTokenSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tokenName, setTokenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      description: "Token copied to clipboard",
      style: { backgroundColor: "#57D7E2", color: "white" }
    });
  };

  const handleGenerateToken = async () => {
    if (!tokenName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your token.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Please log in again to generate a token");
      }

      const token = uuidv4();
      const { error } = await supabase.from('api_tokens').insert([
        {
          user_id: user?.id,
          token,
          name: tokenName
        }
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API token generated successfully!",
        style: { backgroundColor: "#57D7E2", color: "white" }
      });

      // Show token to user with copy button
      toast({
        title: "Your API Token",
        description: (
          <div className="flex items-center gap-2">
            <code className="bg-black/10 p-1 rounded">{token}</code>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleCopyToken(token)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ),
        duration: 10000
      });

      setTokenName("");
    } catch (error: any) {
      console.error("Token generation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

        <Button 
          onClick={handleGenerateToken}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate New Token"}
        </Button>
      </div>
    </Card>
  );
};