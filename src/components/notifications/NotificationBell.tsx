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
  const [isOpen, setIsOpen] = useState(false);
  const [clearedTimestamp, setClearedTimestamp] = useState<number | null>(null);

  const { data: notifications } = useNotifications(lastCheck);

  useEffect(() => {
    if (notifications?.length && !isOpen) {
      const newItems = notifications.filter(
        item => {
          const itemTime = new Date(item.created_at).getTime();
          return itemTime > lastCheck && (!clearedTimestamp || itemTime > clearedTimestamp);
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
  }, [notifications, lastCheck, toast, isOpen, clearedTimestamp]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHasNewItems(false);
    }
  };

  const clearNotifications = () => {
    setLastCheck(Date.now());
    setClearedTimestamp(Date.now());
    setHasNewItems(false);
    setNotificationCount(0);
  };

  const filteredNotifications = notifications?.filter(
    item => !clearedTimestamp || new Date(item.created_at).getTime() > clearedTimestamp
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
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
          notifications={filteredNotifications} 
          onClear={clearNotifications}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};