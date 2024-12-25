import { Database, HelpCircle, Home, PanelLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSidebar } from "@/components/ui/sidebar"; 
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { DatasetSearchCommand } from "@/components/datasets/DatasetSearchCommand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const { user } = useAuth();
  const { toggleSidebar, state } = useSidebar();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
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

  if (isLoading) {
    return (
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/40 bg-card transition-[margin-left] duration-200",
        state === "collapsed" ? "ml-[var(--sidebar-width-icon)]" : "ml-[var(--sidebar-width)]"
      )}>
        <div className="container flex h-full items-center">
          <div className="animate-pulse h-4 w-48 bg-muted rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/40 bg-card transition-all duration-300",
      state === "collapsed" ? "ml-[var(--sidebar-width-icon)]" : "ml-[var(--sidebar-width)]"
    )}>
      <div className="container flex h-full items-center">
        <div className="flex items-center">
          <img 
            src="/brand/flux_logo_01.png" 
            alt="Flux Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Welcome message - always visible */}
        <div className="hidden md:block ml-8">
          <span className="text-sm text-muted-foreground">
            Welcome back{" "}
            <span className="font-medium text-foreground">
              {user?.email}
            </span>
          </span>
        </div>

        <div className="flex-1" />

        {/* Dataset Search Command */}
        <DatasetSearchCommand />

        {/* Query Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 hover:bg-[#4fd9e8] hover:text-white transition-colors" 
          asChild
        >
          <Link to="/datasets?tab=query">
            <Database className="h-5 w-5" />
          </Link>
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

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-[#4fd9e8] hover:text-white transition-colors"
            >
              <Settings className="h-5 w-5" />
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
