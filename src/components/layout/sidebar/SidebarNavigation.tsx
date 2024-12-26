import { Link, useLocation } from "react-router-dom";
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
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

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
  { title: "User", icon: User, url: "/user" },
];

const infoItems = [
  { title: "Company", icon: Building2, url: "/company" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Help", icon: HelpCircle, url: "/guide" },
];

interface SidebarNavigationProps {
  state: "expanded" | "collapsed";
}

export const SidebarNavigation = ({ state }: SidebarNavigationProps) => {
  const location = useLocation();

  const isActive = (url: string) => {
    return location.pathname === url || 
           (url !== "/" && location.pathname.startsWith(url));
  };

  const renderNavigationItem = (item: { title: string; icon: any; url: string }) => (
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
  );

  return (
    <>
      <SidebarMenu>
        {navigationItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        {profileItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        {infoItems.map(renderNavigationItem)}
      </SidebarMenu>
    </>
  );
};