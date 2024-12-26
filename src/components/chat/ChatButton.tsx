import { Button } from "@/components/ui/button";
import { Robot } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatInterface } from "./ChatInterface";

export const ChatButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Robot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>SQL Query Assistant</SheetTitle>
        </SheetHeader>
        <ChatInterface />
      </SheetContent>
    </Sheet>
  );
};