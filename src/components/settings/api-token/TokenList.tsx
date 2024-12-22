import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Token {
  id: string;
  token: string;
  name: string;
}

interface TokenListProps {
  tokens: Token[];
  onDelete: (tokenId: string) => Promise<void>;
}

export const TokenList = ({ tokens, onDelete }: TokenListProps) => {
  const { toast } = useToast();
  const [showFullToken, setShowFullToken] = useState<string | null>(null);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      description: "Token copied to clipboard",
      style: { backgroundColor: "#57D7E2", color: "white" }
    });
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setShowFullToken(showFullToken === tokenId ? null : tokenId);
  };

  const maskToken = (token: string) => {
    return `...${token.slice(-4)}`;
  };

  return (
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
              onClick={() => onDelete(token.id)}
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
  );
};