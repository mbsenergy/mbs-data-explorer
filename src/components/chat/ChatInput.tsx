import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2 } from "lucide-react";

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onClear: () => void;
}

export const ChatInput = ({ isLoading, onSubmit, onClear }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[40px] max-h-[120px] pr-[88px] text-sm metallic-card resize-none"
      />
      <div className="absolute right-2 top-1.5 flex gap-1">
        <Button 
          type="button"
          size="icon"
          variant="ghost"
          onClick={onClear}
          className="h-[32px] w-[32px] text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 h-[32px] w-[32px] shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};