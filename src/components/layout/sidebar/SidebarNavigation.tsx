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
  Briefcase,
  Navigation,
  UserCircle,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Scenario", icon: LineChart, url: "/scenario" },
  { title: "Osservatorio", icon: Zap, url: "/osservatorio" },
];

const workItems = [
  { title: "Datasets", icon: Database, url: "/datasets" },
  { title: "Visualize", icon: BarChart2, url: "/visualize" },
  { title: "Developer", icon: Code, url: "/developer" },
];

const profileItems = [
  { title: "User", icon: User, url: "/user" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
];

const otherItems = [
  { title: "Company", icon: Building2, url: "/company" },
  { title: "Help", icon: HelpCircle, url: "/guide" },
  { title: "Settings", icon: Settings, url: "/settings" },
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

  const renderSectionLabel = (label: string) => (
    <div className={cn(
      "px-4 py-2 text-xs font-medium text-muted-foreground",
      state === "collapsed" ? "opacity-0" : "opacity-100"
    )}>
      {label}
    </div>
  );

  return (
    <>
      <SidebarMenu>
        {renderSectionLabel("Navigation")}
        {navItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        {renderSectionLabel("Work")}
        {workItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        {renderSectionLabel("Profile")}
        {profileItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        {renderSectionLabel("Other")}
        {otherItems.map(renderNavigationItem)}
      </SidebarMenu>
    </>
  );
};