import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/" className="text-lg font-bold">MyApp</Link>
      <div className="flex items-center">
        <Button onClick={() => setIsOpen(!isOpen)} className="mr-4">
          {isOpen ? "Close" : "Menu"}
        </Button>
        {user ? (
          <div className="flex items-center">
            <span className="mr-4">{user.email}</span>
            <Button onClick={handleSignOut}>Sign Out</Button>
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

export default Navbar;