import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
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
        <Button variant="ghost" size="icon" className="relative">
          <Bot className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 metallic-card border border-border/40 w-[600px] max-h-[600px]">
        <div className="h-full flex flex-col">
          <DialogHeader className="px-4 py-3 border-b border-border/40">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                FluxerBuddy
              </span>
            </DialogTitle>
          </DialogHeader>
          <ChatInterface messages={messages} setMessages={setMessages} />
        </div>
      </DialogContent>
    </Dialog>
  );
};