import { HelpCircle, Home, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <nav className="h-16 border-b border-border/40 bg-card">
      <div className="container flex h-full items-center">
        {/* Welcome message */}
        <div className="hidden md:block">
          <span className="text-sm text-muted-foreground">
            Welcome back{" "}
            <span className="font-medium text-foreground">
              {profile?.first_name} {profile?.last_name}
            </span>
          </span>
        </div>

        <div className="flex-1" />

        {/* Help button */}
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link to="/guide">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
                alt="avatar" 
              />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>User</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};