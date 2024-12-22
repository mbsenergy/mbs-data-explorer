import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  Building,
  BookOpen,
  Database,
  ChevronLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebarContext,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: Database,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

const userMenuItems = [
  {
    title: "User",
    url: "/user",
    icon: User,
  },
  {
    title: "Company",
    url: "/company",
    icon: Building,
  },
];

const settingsMenuItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Guide",
    url: "/guide",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { collapsed, toggleSidebar } = useSidebarContext();

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <Sidebar 
      className={`bg-card border-r border-border/40 transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col items-start">
              <img 
                src="/lovable-uploads/5c908079-22b4-4807-83e2-573ab0d0f160.png" 
                alt="MBS Logo" 
                className="h-8 w-auto"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={collapsed ? item.title : undefined}
                    className={isActive(item.url) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={collapsed ? item.title : undefined}
                    className={isActive(item.url) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={collapsed ? item.title : undefined}
                    className={isActive(item.url) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
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
              tooltip={collapsed ? "Logout" : undefined}
              className="w-full hover:bg-muted/50"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Log out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}