import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const NotificationBell = () => {
  const { toast } = useToast();
  const [hasNewItems, setHasNewItems] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [notificationCount, setNotificationCount] = useState(0);

  // Query for latest files across all relevant buckets
  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications", lastCheck],
    queryFn: async () => {
      const buckets = ['latest', 'report-scenario', 'osservatorio-energia'];
      const allFiles = await Promise.all(
        buckets.map(async (bucket) => {
          const { data: files, error } = await supabase
            .storage
            .from(bucket)
            .list('', {
              limit: 10,
              sortBy: { column: 'created_at', order: 'desc' }
            });

          if (error) {
            console.error(`Error fetching files from ${bucket}:`, error);
            return [];
          }

          return files.map(file => ({
            ...file,
            bucket,
            type: file.name.split('.').pop()?.toLowerCase()
          }));
        })
      );

      return allFiles.flat().sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Check for new items
  useEffect(() => {
    if (notifications?.length) {
      const newItems = notifications.filter(
        item => new Date(item.created_at).getTime() > lastCheck
      );
      const count = newItems.length;
      setNotificationCount(count);
      if (count > 0) {
        setHasNewItems(true);
        toast({
          title: "New Content Available",
          description: `${count} new item${count === 1 ? '' : 's'} added.`,
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
    refetch();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 relative" 
          onClick={handleOpen}
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
        <div className="flex justify-between items-center p-2 border-b">
          <span className="font-medium">Notifications</span>
          {notifications?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearNotifications}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
        {notifications?.slice(0, 5).map((file) => (
          <DropdownMenuItem key={`${file.bucket}-${file.name}`} className="flex flex-col items-start">
            <span className="font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              Added to {file.bucket} - {new Date(file.created_at).toLocaleString()}
            </span>
          </DropdownMenuItem>
        ))}
        {(!notifications || notifications.length === 0) && (
          <DropdownMenuItem disabled>
            No new notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};