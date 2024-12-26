import { LogOut, PanelLeftClose } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return (
    <Sidebar className="bg-card border-r border-border/40 metallic-card">
      <SidebarContent className="mt-20">
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

        <SidebarNavigation state={state} />
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