import { Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <nav className="h-16 navbar-dark backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-full items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
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
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5" />
        </Button>

        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
            alt="avatar" 
          />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};