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
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

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
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <img 
          src="/lovable-uploads/5c908079-22b4-4807-83e2-573ab0d0f160.png" 
          alt="MBS Logo" 
          className="h-8"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
                  <SidebarMenuButton asChild>
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
                  <SidebarMenuButton asChild>
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
    </Sidebar>
  );
}