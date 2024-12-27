import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, clearTimestamp, setClearTimestamp } = useNotifications();

  useEffect(() => {
    if (notifications?.length && !isOpen) {
      const newItems = notifications.filter(
        item => {
          const itemTime = new Date(item.created_at).getTime();
          return itemTime > lastCheck && (!clearTimestamp || itemTime > clearTimestamp);
        }
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
  }, [notifications, lastCheck, toast, isOpen, clearTimestamp]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHasNewItems(false);
    }
  };

  const handleClearNotifications = () => {
    const now = Date.now();
    setLastCheck(now);
    setClearTimestamp(now);
    setHasNewItems(false);
    setNotificationCount(0);
  };

  const filteredNotifications = notifications?.filter(
    item => !clearTimestamp || new Date(item.created_at).getTime() > clearTimestamp
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative mr-2 hover:bg-[#4fd9e8] hover:text-white transition-colors"
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
          notifications={filteredNotifications} 
          onClear={handleClearNotifications}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};