import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/datasets")}>Datasets</Button>
        <Button onClick={() => navigate("/visualize")}>Visualize</Button>
      </div>
      <NotificationBell notifications={notifications} />
    </nav>
  );
};

export default Navbar;
