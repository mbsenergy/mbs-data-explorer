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
import { Message, ExpertiseMode } from "./types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expertiseMode, setExpertiseMode] = useState<ExpertiseMode>('data');

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
      <DialogContent className="p-0 metallic-card border-2 border-border/60 w-[80vw] max-w-[1200px] h-[80vh] gap-0">
        <div className="h-full flex flex-col">
          <DialogHeader className="px-4 py-3 border-b border-border/40 bg-card/50">
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                FluxerBuddy Assistant
              </span>
            </DialogTitle>
            <Tabs value={expertiseMode} onValueChange={(value) => setExpertiseMode(value as ExpertiseMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data">Data & Code Expert</TabsTrigger>
                <TabsTrigger value="energy">Energy Expert</TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>
          <ChatInterface 
            messages={messages} 
            setMessages={setMessages} 
            expertiseMode={expertiseMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};