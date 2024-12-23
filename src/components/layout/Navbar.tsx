import { HelpCircle, Home, User, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const handleExplore = () => {
    navigate('/datasets');
    // Scroll to explore section after a short delay to ensure navigation is complete
    setTimeout(() => {
      const exploreSection = document.querySelector('[data-explore-section]');
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/40 bg-card ml-[var(--sidebar-width)]">
        <div className="container flex h-full items-center">
          <div className="animate-pulse h-4 w-48 bg-muted rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/40 bg-card ml-[var(--sidebar-width)]">
      <div className="container flex h-full items-center">
        {/* Welcome message - always visible */}
        <div className="hidden md:block">
          <span className="text-sm text-muted-foreground">
            Welcome back{" "}
            <span className="font-medium text-foreground">
              {profile?.first_name} {profile?.last_name}
            </span>
          </span>
        </div>

        <div className="flex-1" />

        {/* Explore button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 hover:bg-[#4fd9e8] hover:text-white transition-colors"
          onClick={handleExplore}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Help button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 hover:bg-[#4fd9e8] hover:text-white transition-colors" 
          asChild
        >
          <Link to="/guide">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notifications */}
        <div className="mr-2">
          <NotificationBell />
        </div>

        {/* Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-[#4fd9e8] hover:text-white transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
                  alt="avatar" 
                />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-40"
          >
            <DropdownMenuItem asChild className="hover:bg-[#4fd9e8] hover:text-white transition-colors">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#4fd9e8] hover:text-white transition-colors">
              <Link to="/user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>User</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#4fd9e8] hover:text-white transition-colors">
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