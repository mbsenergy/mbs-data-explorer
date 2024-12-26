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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 metallic-card border-l border-border/40">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-background/50">
            <div className="h-full w-full" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={40} className="p-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-6 w-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                  FluxerBuddy
                </span>
              </SheetTitle>
            </SheetHeader>
            <ChatInterface />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SheetContent>
    </Sheet>
  );
};