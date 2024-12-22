import { LogOut, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebarContext,
} from "@/components/ui/sidebar"
import { supabase } from "@/integrations/supabase/client"
import { MainMenuItems } from "./sidebar/MainMenuItems"
import { UserMenuItems } from "./sidebar/UserMenuItems"
import { SystemMenuItems } from "./sidebar/SystemMenuItems"

export function AppSidebar() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { collapsed, setOpen } = useSidebarContext()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

  const toggleSidebar = () => {
    setOpen(!collapsed)
  }

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
            <MainMenuItems />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <UserMenuItems />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SystemMenuItems />
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
  )
}