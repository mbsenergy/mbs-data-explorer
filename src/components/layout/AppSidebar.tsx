import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BarChart3,
  Database,
  FileText,
  Home,
  Settings,
  Terminal,
} from "lucide-react";

export const AppSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex h-16 items-center justify-center border-b px-4">
          <img
            src="/lovable-uploads/e76c927a-137e-41dd-ad35-6adbe3787d4d.png"
            alt="Flux Data Platform"
            className="h-8"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            <NavLink to="/" icon={<Home className="h-4 w-4" />}>
              Home
            </NavLink>
            <NavLink to="/datasets" icon={<Database className="h-4 w-4" />}>
              Datasets
            </NavLink>
            <NavLink to="/analytics" icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </NavLink>
            <NavLink to="/developer" icon={<Terminal className="h-4 w-4" />}>
              Developer
            </NavLink>
            <NavLink to="/docs" icon={<FileText className="h-4 w-4" />}>
              Documentation
            </NavLink>
          </nav>
          <nav className="space-y-1">
            <NavLink to="/settings" icon={<Settings className="h-4 w-4" />}>
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, children }: NavLinkProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = location.pathname === to;

  // Protect routes that require authentication
  if (!user && to !== "/") {
    return null;
  }

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isActive && "bg-muted text-foreground"
        )}
      >
        {icon}
        <span className="ml-2">{children}</span>
      </Button>
    </Link>
  );
};