import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatInterface } from "./ChatInterface";
import { useState } from "react";
import { Message } from "./types";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative hover:bg-primary/10 transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 metallic-card border border-border/40 w-[600px] max-h-[600px] gap-0">
        <div className="h-full flex flex-col">
          <DialogHeader className="px-3 py-2 border-b border-border/40 bg-card/50">
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                FluxerBuddy Assistant
              </span>
            </DialogTitle>
          </DialogHeader>
          <ChatInterface messages={messages} setMessages={setMessages} />
        </div>
      </DialogContent>
    </Dialog>
  );
};