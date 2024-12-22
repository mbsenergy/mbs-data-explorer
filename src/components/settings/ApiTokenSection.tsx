import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';

export const ApiTokenSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tokenName, setTokenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFullToken, setShowFullToken] = useState<string | null>(null);

  // Fetch existing tokens
  const { data: tokens, refetch } = useQuery({
    queryKey: ["api-tokens", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      description: "Token copied to clipboard",
      style: { backgroundColor: "#57D7E2", color: "white" }
    });
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('api_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      await refetch();
      toast({
        description: "Token deleted successfully",
        style: { backgroundColor: "#57D7E2", color: "white" }
      });
    } catch (error: any) {
      console.error("Error deleting token:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
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

      await refetch();
      toast({
        title: "Success",
        description: "API token generated successfully!",
        style: { backgroundColor: "#57D7E2", color: "white" }
      });

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

  const toggleTokenVisibility = (tokenId: string) => {
    setShowFullToken(showFullToken === tokenId ? null : tokenId);
  };

  const maskToken = (token: string) => {
    return `...${token.slice(-4)}`;
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

        {tokens && tokens.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Your API Tokens</h4>
            <div className="space-y-2">
              {tokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <code className="text-sm text-muted-foreground">
                      {showFullToken === token.id ? token.token : maskToken(token.token)}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTokenVisibility(token.id)}
                    >
                      {showFullToken === token.id ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyToken(token.token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteToken(token.id)}
                    >
                      <span className="sr-only">Delete token</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};