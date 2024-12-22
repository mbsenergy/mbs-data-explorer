import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <img
            src="https://github.com/shadcn.png"
            alt="avatar"
            className="rounded-full"
          />
        </Button>
      </div>
    </nav>
  );
};