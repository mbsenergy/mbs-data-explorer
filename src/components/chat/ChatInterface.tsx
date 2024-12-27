import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const ChatInterface = ({ messages, setMessages }: ChatInterfaceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (userMessage: string) => {
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

  const clearChat = () => {
    setMessages([]);
    toast({
      description: "Chat history cleared"
    });
  };

  const splitMessageContent = (content: string) => {
    const segments = [];
    let currentText = '';
    const codeBlockRegex = /```[\s\S]*?```/g;
    let lastIndex = 0;

    content.replace(codeBlockRegex, (match, index) => {
      if (index > lastIndex) {
        const text = content.slice(lastIndex, index).trim();
        if (text) segments.push({ type: 'text', content: text });
      }
      segments.push({ type: 'code', content: match });
      lastIndex = index + match.length;
      return match;
    });

    if (lastIndex < content.length) {
      const text = content.slice(lastIndex).trim();
      if (text) segments.push({ type: 'text', content: text });
    }

    return segments.length > 0 ? segments : [{ type: 'text', content }];
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(80vh-3rem)]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-background/50">
        <p className="text-xs text-muted-foreground">Messages</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No messages yet. Start a conversation!
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="space-y-2">
                {message.role === 'assistant' ? (
                  splitMessageContent(message.content).map((segment, idx) => (
                    <MessageBubble
                      key={`${index}-${idx}`}
                      message={message}
                      segment={segment}
                      index={index}
                      idx={idx}
                    />
                  ))
                ) : (
                  <MessageBubble
                    message={message}
                    segment={{ type: 'text', content: message.content }}
                    index={index}
                    idx={0}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border/40 bg-card/50">
        <div className="flex gap-2">
          <ChatInput isLoading={isLoading} onSubmit={handleSubmit} />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearChat}
            className="h-[40px] w-[40px] text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};