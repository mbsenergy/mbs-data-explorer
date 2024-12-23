import {
  LayoutDashboard,
  Settings,
  User,
  Building2,
  HelpCircle,
  Database,
  BarChart3,
  Zap,
  Code,
  LineChart,
  LogOut,
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

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Scenario", icon: LineChart, url: "/scenario" },
  { title: "Osservatorio", icon: Zap, url: "/osservatorio" },
  { title: "Datasets", icon: Database, url: "/datasets" },
  { title: "Developer", icon: Code, url: "/developer" },
];

const profileItems = [
  { title: "User", icon: User, url: "/user" },
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
    <Sidebar className="bg-card border-r border-border/40">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start w-full">
            <img 
              src="/lovable-uploads/0c6149ce-5bdd-4635-843d-2e8d1e9b325b.png" 
              alt="Flux Logo" 
              className="w-full h-auto object-contain px-2"
            />
            <span className="text-sm font-bold mt-3 text-muted-foreground">DATA PLATFORM</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-muted text-[#4fd9e8] font-medium" : "hover:bg-muted/50"}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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
            <SidebarMenuButton onClick={handleLogout} className="w-full hover:bg-muted/50">
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
