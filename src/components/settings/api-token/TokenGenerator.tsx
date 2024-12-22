import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TokenGeneratorProps {
  onGenerate: (name: string) => Promise<void>;
  isLoading: boolean;
}

export const TokenGenerator = ({ onGenerate, isLoading }: TokenGeneratorProps) => {
  const [tokenName, setTokenName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenName.trim()) {
      await onGenerate(tokenName);
      setTokenName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tokenName">Token Name</Label>
        <Input
          id="tokenName"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="e.g., Development Token"
        />
      </div>
      <Button type="submit" disabled={isLoading || !tokenName.trim()}>
        {isLoading ? "Generating..." : "Generate New Token"}
      </Button>
    </form>
  );
};