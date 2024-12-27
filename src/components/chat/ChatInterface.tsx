import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Message } from "./types";

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const ChatInterface = ({ messages, setMessages }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-mistral', {
        body: { message: userMessage }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling Mistral AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
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

  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <pre className="bg-card p-2 rounded-lg overflow-x-auto border border-border/40 font-jetbrains-mono text-sm">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-card px-1.5 py-0.5 rounded font-jetbrains-mono text-primary text-sm" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(600px-4rem)]">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[60%] text-sm ${
                  message.role === 'user'
                    ? 'metallic-card text-primary-foreground'
                    : 'glass-panel border-l-2 border-l-primary'
                }`}
              >
                <ReactMarkdown 
                  className="prose prose-invert prose-sm max-w-none prose-pre:my-0 prose-p:leading-relaxed prose-p:my-1"
                  components={components}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/40 bg-background/50">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can I help?"
              className="min-h-[60px] max-h-[120px] text-sm metallic-card resize-none"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 h-[60px] px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">AI Powered by MBS-Energy</p>
        </form>
      </div>
    </div>
  );
};