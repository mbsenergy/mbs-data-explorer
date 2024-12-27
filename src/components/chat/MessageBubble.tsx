import { Message } from "./types";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Components } from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  segment: { type: 'text' | 'code'; content: string };
  index: number;
  idx: number;
}

export const MessageBubble = ({ message, segment, index, idx }: MessageBubbleProps) => {
  const { toast } = useToast();

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy code",
      });
    }
  };

  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = children.toString();
      return match ? (
        <div className="relative w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 bg-primary/10 hover:bg-primary/20"
            onClick={() => handleCopyCode(codeContent)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <pre className="bg-card/50 rounded-md overflow-x-auto border border-border/40 font-jetbrains-mono text-xs w-full">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-card/50 px-1.5 py-0.5 rounded font-jetbrains-mono text-primary text-xs" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => (
      <p className="mb-2 leading-relaxed">{children}</p>
    )
  };

  return (
    <div
      key={`${index}-${idx}`}
      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`rounded-lg px-4 py-2.5 max-w-[85%] text-sm ${
        message.role === 'assistant' 
          ? 'bg-[#222222] border-l-2 border-l-primary w-full' 
          : 'bg-[#1a2f1a]/80 backdrop-blur-sm border border-emerald-800/30 shadow-lg text-emerald-50'
      }`}>
        <ReactMarkdown 
          className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed"
          components={components}
        >
          {segment.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};