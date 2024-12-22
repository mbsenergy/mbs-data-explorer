import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface StatsCardsProps {
  lastConnection: string | null;
  connectionsThisYear: number | null;
  totalDownloads: number;
  lastConnectionLoading: boolean;
  connectionsLoading: boolean;
  analyticsLoading: boolean;
}

export const StatsCards = ({
  lastConnection,
  connectionsThisYear,
  totalDownloads,
  lastConnectionLoading,
  connectionsLoading,
  analyticsLoading,
}: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Last Connection</h3>
        <div className="mt-2 text-2xl font-bold">
          {lastConnectionLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            lastConnection ? format(new Date(lastConnection), 'dd MMM yyyy HH:mm') : 'Never'
          )}
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Connections This Year</h3>
        <div className="mt-2 text-2xl font-bold">
          {connectionsLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            connectionsThisYear
          )}
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Total Downloads</h3>
        <div className="mt-2 text-2xl font-bold">
          {analyticsLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            totalDownloads
          )}
        </div>
      </Card>
    </div>
  );
};