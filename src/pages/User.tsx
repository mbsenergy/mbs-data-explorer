import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

const User = () => {
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
    enabled: !!user,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <Card className="p-6 glass-panel">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
            alt="Profile"
            className="h-16 w-16 rounded-full bg-muted"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-muted-foreground">
              {profile?.is_cerved ? "Cerved User" : "Standard User"}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default User;