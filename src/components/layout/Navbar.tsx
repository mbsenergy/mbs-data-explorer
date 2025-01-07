import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { ChatButton } from "@/components/chat/ChatButton";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getInitials = (email: string) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return email?.substring(0, 2).toUpperCase() || "U";
  };

  const getLevelColor = (level: string) => {
    const normalizedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    
    switch (normalizedLevel) {
      case 'Premium':
        return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600';
      case 'Plus':
        return 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border/40 metallic-card">
      {/* Left Section */}
      <div className="flex-1">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          Welcome, <h3 className="inline text-white font-semibold">{profile?.first_name || user?.email}</h3>
          {profile?.level && (
            <Badge className={`${getLevelColor(profile.level)} border-none text-xs`}>
              {profile.level.charAt(0).toUpperCase() + profile.level.slice(1).toLowerCase()}
            </Badge>
          )}
        </span>
      </div>

      {/* Center Logo */}
      <div className="flex-1 flex justify-center items-center">
        <img 
          src="/brand/flux_logo_02.png" 
          alt="Company Logo" 
          className="h-8 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-end space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/datasets?tab=query")}
          className="hidden md:flex"
        >
          <Database className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/guide")}
          className="hidden md:flex"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <NotificationBell />
        
        <ChatButton />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} alt={user.email || ""} />
                  <AvatarFallback className="bg-muted">
                    {getInitials(user.email || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/user")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};