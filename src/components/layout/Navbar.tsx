import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Search, Database, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSearchClick = () => {
    navigate('/datasets');
    // Add a small delay to ensure navigation is complete
    setTimeout(() => {
      // Scroll to the search section
      const searchSection = document.querySelector('[data-search-section]');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border/40 metallic-card">
      <div className="flex items-center space-x-8">
        {/* Company Logo */}
        <div className="flex items-center">
          <img 
            src="/brand/flux_logo_02.png" 
            alt="Company Logo" 
            className="h-8"
          />
        </div>

        {/* Welcome Message */}
        <div className="hidden md:block">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.email}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSearchClick}
          className="hidden md:flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search Dataset
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/datasets/query")}
          className="hidden md:flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Query
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/guide")}
          className="hidden md:flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>

        <NotificationBell />

        {user ? (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};