import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Activity, MessageSquare, Network, Timer } from "lucide-react";

interface StatsCardsProps {
  lastConnection: string;
  connectionsThisYear: number;
  totalDownloads: number;
  totalChats: number;
  isLoading: {
    lastConnection: boolean;
    connections: boolean;
    analytics: boolean;
    chat: boolean;
  };
}

export const StatsCards = ({ 
  lastConnection, 
  connectionsThisYear, 
  totalDownloads,
  totalChats,
  isLoading 
}: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Last Connection</h3>
        </div>
        {isLoading.lastConnection ? (
          <Skeleton className="h-8 w-[200px] mt-2" />
        ) : (
          <p className="mt-2 text-2xl font-bold">
            {lastConnection ? formatDistanceToNow(new Date(lastConnection), { addSuffix: true }) : 'Never'}
          </p>
        )}
      </Card>

      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Connections This Year</h3>
        </div>
        {isLoading.connections ? (
          <Skeleton className="h-8 w-[100px] mt-2" />
        ) : (
          <p className="mt-2 text-2xl font-bold">
            {connectionsThisYear.toLocaleString()}
          </p>
        )}
      </Card>

      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Total Downloads</h3>
        </div>
        {isLoading.analytics ? (
          <Skeleton className="h-8 w-[100px] mt-2" />
        ) : (
          <p className="mt-2 text-2xl font-bold">
            {totalDownloads.toLocaleString()}
          </p>
        )}
      </Card>

      <Card className="p-6 metallic-card">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Total Chats</h3>
        </div>
        {isLoading.chat ? (
          <Skeleton className="h-8 w-[100px] mt-2" />
        ) : (
          <p className="mt-2 text-2xl font-bold">
            {totalChats.toLocaleString()}
          </p>
        )}
      </Card>
    </div>
  );
};