import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LineChart,
  Eye,
  Database,
  BarChart2,
  Building2,
  Settings,
  User as UserIcon,
  FileText,
  Code,
  Wand2,
  StickyNote,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navigation = [
  // Main section
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Scenario", to: "/scenario", icon: LineChart },
  { name: "Osservatorio", to: "/osservatorio", icon: Eye },
  { type: "separator" },
  // Data section
  { name: "Datasets", to: "/datasets", icon: Database },
  { name: "Data Wrangle", to: "/datawrangle", icon: Wand2 },
  { name: "Developer", to: "/developer", icon: Code },
  { name: "Notes & Flows", to: "/notes", icon: StickyNote },
  { type: "separator" },
  // User section
  { name: "User", to: "/user", icon: UserIcon },
  { name: "Analytics", to: "/analytics", icon: BarChart2 },
  { name: "Settings", to: "/settings", icon: Settings },
  { type: "separator" },
  // Info section
  { name: "Guide", to: "/guide", icon: FileText },
  { name: "Company", to: "/company", icon: Building2 },
];

interface SidebarNavigationProps {
  className?: string;
  state?: "expanded" | "collapsed";
}

export function SidebarNavigation({ className, state }: SidebarNavigationProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {navigation.map((item, index) => {
        if (item.type === "separator") {
          return (
            <Separator 
              key={`sep-${index}`} 
              className="my-3 bg-white/10" 
            />
          );
        }

        return (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center px-3 py-2 text-sm font-light rounded-md hover:bg-muted hover:text-white group text-white/90"
          >
            <item.icon
              className="w-5 h-5 mr-3 text-white"
              aria-hidden="true"
            />
            {state !== "collapsed" && item.name}
          </Link>
        );
      })}
    </nav>
  );
}