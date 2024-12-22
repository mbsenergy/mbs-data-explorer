import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "./NotificationList";

export const NotificationBell = () => {
  const { toast } = useToast();
  const [hasNewItems, setHasNewItems] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: notifications } = useNotifications(lastCheck);

  useEffect(() => {
    if (notifications?.length) {
      const newItems = notifications.filter(
        item => new Date(item.created_at).getTime() > lastCheck
      );
      
      if (newItems.length > 0) {
        setNotificationCount(newItems.length);
        setHasNewItems(true);
        toast({
          title: "New Content Available",
          description: `${newItems.length} new item${newItems.length === 1 ? '' : 's'} added.`,
        });
      }
    }
  }, [notifications, lastCheck, toast]);

  const handleOpen = () => {
    setHasNewItems(false);
  };

  const clearNotifications = () => {
    setLastCheck(Date.now());
    setHasNewItems(false);
    setNotificationCount(0);
  };

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative mr-2"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasNewItems && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationList 
          notifications={notifications} 
          onClear={clearNotifications}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};