import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const ChatInterface = ({ messages, setMessages }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-mistral', {
        body: { message: userMessage }
      });

      if (error) throw error;

      setMessages([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling Mistral AI:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      description: "Chat history cleared"
    });
  };

  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <pre className="bg-card/50 p-2 rounded-md overflow-x-auto border border-border/40 font-jetbrains-mono text-xs">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-card/50 px-1.5 py-0.5 rounded font-jetbrains-mono text-primary text-xs" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(600px-3rem)]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-background/50">
        <p className="text-xs text-muted-foreground">Messages</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
          className="h-6 px-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No messages yet. Start a conversation!
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-1.5 max-w-[90%] text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border-l-2 border-l-primary'
                  }`}
                >
                  <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none prose-pre:my-0 prose-p:leading-relaxed prose-p:my-0.5"
                    components={components}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border/40 bg-card/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[120px] text-sm metallic-card resize-none"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 h-[40px] w-[40px] shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};