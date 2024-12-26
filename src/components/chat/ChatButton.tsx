import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatInterface } from "./ChatInterface";
import { useState } from "react";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 metallic-card border-l border-border/40 w-[600px] min-w-[400px] max-w-[1200px] resize-x overflow-hidden">
        <div className="h-full p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                FluxerBuddy
              </span>
            </SheetTitle>
          </SheetHeader>
          <ChatInterface />
        </div>
      </SheetContent>
    </Sheet>
  );
};