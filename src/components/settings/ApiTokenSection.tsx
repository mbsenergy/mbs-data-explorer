import { useState } from "react";
import { Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { TokenList } from "./api-token/TokenList";
import { TokenGenerator } from "./api-token/TokenGenerator";

export const ApiTokenSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGenerateToken = async (tokenName: string) => {
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
          </div>
        ),
        duration: 10000
      });
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

  return (
    <CollapsibleCard title="API Token" icon={<Key className="h-5 w-5" />}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate an API token to access our services programmatically.
        </p>

        <TokenGenerator 
          onGenerate={handleGenerateToken}
          isLoading={isLoading}
        />

        {tokens && tokens.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Your API Tokens</h4>
            <TokenList 
              tokens={tokens}
              onDelete={handleDeleteToken}
            />
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};