import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NotificationListProps {
  notifications: Array<{ bucket: string; name: string }>;
  onClear: () => void;
}

export const NotificationList = ({ notifications, onClear }: NotificationListProps) => {
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
  };

  return (
    <>
      <div className="flex justify-between items-center p-2 border-b">
        <span className="font-medium">Notifications</span>
        {notifications?.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="text-xs hover:bg-[#4fd9e8] hover:text-white transition-colors"
          >
            Clear all
          </Button>
        )}
      </div>
      {notifications?.slice(0, 5).map((file) => (
        <DropdownMenuItem 
          key={`${file.bucket}-${file.name}`} 
          className="flex flex-col items-start hover:bg-[#4fd9e8] hover:text-white transition-colors"
        >
          <span className="font-medium">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            Added to {file.bucket.replace(/-/g, ' ')}
          </span>
        </DropdownMenuItem>
      ))}
      {(!notifications || notifications.length === 0) && (
        <DropdownMenuItem disabled>
          No new notifications
        </DropdownMenuItem>
      )}
    </>
  );
};