import {
  LayoutDashboard,
  Settings,
  BarChart2,
  Building2,
  HelpCircle,
  Database,
  BarChart3,
  Zap,
  Code,
  LineChart,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Scenario", icon: LineChart, url: "/scenario" },
  { title: "Osservatorio", icon: Zap, url: "/osservatorio" },
  { title: "Datasets", icon: Database, url: "/datasets" },
  { title: "Developer", icon: Code, url: "/developer" },
  { title: "Visualize", icon: BarChart2, url: "/visualize" },
];

const profileItems = [
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
];

const infoItems = [
  { title: "Company", icon: Building2, url: "/company" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Help", icon: HelpCircle, url: "/guide" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      
      // Clear auth token before signing out
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      if (projectId) {
        localStorage.removeItem('sb-' + projectId + '-auth-token');
      }
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
      }
      
      // Always navigate to login page and show success message
      navigate("/login");
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
      
    } catch (error) {
      console.error("Caught error during logout:", error);
      navigate("/login");
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
    }
  };

  const isActive = (url: string) => {
    return location.pathname === url || 
           (url !== "/" && location.pathname.startsWith(url));
  };

  return (
    <Sidebar className="bg-card border-r border-border/40 metallic-card">
      <SidebarContent className="mt-20">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={toggleSidebar} 
                className="w-full hover:bg-muted/50"
                tooltip={state === "collapsed" ? "Toggle Sidebar" : undefined}
              >
                <PanelLeftClose className="h-5 w-5" />
                <span className={cn("transition-all duration-200",
                  state === "collapsed" ? "opacity-0 w-0" : "opacity-100")}>
                  Toggle
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Nav</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-muted text-[#4fd9e8] font-medium" : "hover:bg-muted/50"}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className={cn(
                        "transition-all duration-200",
                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100",
                        "text-xs"
                      )}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-muted text-[#4fd9e8] font-medium" : "hover:bg-muted/50"}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className={cn(
                        "transition-all duration-200",
                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100",
                        "text-xs"
                      )}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-muted text-[#4fd9e8] font-medium" : "hover:bg-muted/50"}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className={cn(
                        "transition-all duration-200",
                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100",
                        "text-xs"
                      )}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="w-full hover:bg-muted/50"
              tooltip={state === "collapsed" ? "Log out" : undefined}
            >
              <LogOut className="h-5 w-5" />
              <span className={cn(
                "transition-all duration-200",
                state === "collapsed" ? "opacity-0 w-0" : "opacity-100",
                "text-xs"
              )}>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}