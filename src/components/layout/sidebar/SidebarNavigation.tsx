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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Scenario", to: "/scenario", icon: LineChart },
  { name: "Osservatorio", to: "/osservatorio", icon: Eye },
  { name: "Datasets", to: "/datasets", icon: Database },
  { name: "Analytics", to: "/analytics", icon: BarChart2 },
  { name: "Company", to: "/company", icon: Building2 },
  { name: "Settings", to: "/settings", icon: Settings },
  { name: "User", to: "/user", icon: UserIcon },
  { name: "Guide", to: "/guide", icon: FileText },
  { name: "Developer", to: "/developer", icon: Code },
  { name: "Data Wrangle", to: "/datawrangle", icon: Wand2 },
];

interface SidebarNavigationProps {
  className?: string;
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted hover:text-white group"
        >
          <item.icon
            className="w-6 h-6 mr-3 text-corporate-teal"
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}