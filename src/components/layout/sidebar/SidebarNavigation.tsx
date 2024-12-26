import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Eye,
  Database,
  BarChart2,
  Code,
  User,
  BarChart3,
  Building2,
  HelpCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Scenario", icon: FileText, url: "/scenario" },
  { title: "Osservatorio", icon: Eye, url: "/osservatorio" },
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
        className={cn(
          isActive(item.url) ? "bg-muted text-[#4fd9e8] font-medium" : "hover:bg-muted/50",
          "transition-colors duration-200"
        )}
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
        <div className="px-2 py-1">
          <p className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            state === "collapsed" ? "opacity-0" : "opacity-100"
          )}>Navigation</p>
        </div>
        {navItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        <div className="px-2 py-1">
          <p className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            state === "collapsed" ? "opacity-0" : "opacity-100"
          )}>Work</p>
        </div>
        {workItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        <div className="px-2 py-1">
          <p className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            state === "collapsed" ? "opacity-0" : "opacity-100"
          )}>Profile</p>
        </div>
        {profileItems.map(renderNavigationItem)}
      </SidebarMenu>

      <SidebarMenu>
        <div className="px-2 py-1">
          <p className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            state === "collapsed" ? "opacity-0" : "opacity-100"
          )}>Other</p>
        </div>
        {otherItems.map(renderNavigationItem)}
      </SidebarMenu>
    </>
  );
};