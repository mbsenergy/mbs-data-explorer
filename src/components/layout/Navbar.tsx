import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { HelpCircle, Search } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="h-16 px-4 border-b bg-background flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/brand/flux_logo_01.png" 
            alt="Flux Logo" 
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/datasets">
            <Button variant="ghost">Datasets</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="ghost">Analytics</Button>
          </Link>
          <Link to="/visualize">
            <Button variant="ghost">Query</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Link to="/guide">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};