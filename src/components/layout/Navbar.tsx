import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">My App</h1>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell />
        {user ? (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};
