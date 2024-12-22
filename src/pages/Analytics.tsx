import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const { user } = useAuth();

  const { data: lastConnection, isLoading: lastConnectionLoading } = useQuery({
    queryKey: ["lastConnection"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_last_connection', {
        user_uuid: user?.id
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user?.id)
        .order("downloaded_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentYear = new Date().getFullYear();
  const connectionsThisYear = analyticsData?.filter(
    (item) => new Date(item.downloaded_at).getFullYear() === currentYear
  ).length || 0;

  const totalDownloads = analyticsData?.length || 0;

  // Prepare data for the line chart
  const dailyDownloads = analyticsData?.reduce((acc: any, curr) => {
    const date = format(new Date(curr.downloaded_at), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(dailyDownloads || {}).map(([date, count]) => ({
    date,
    downloads: count,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Last Connection</h3>
          <div className="mt-2 text-2xl font-bold">
            {lastConnectionLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              lastConnection ? format(new Date(lastConnection), 'dd MMM yyyy HH:mm') : 'Never'
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Connections This Year</h3>
          <div className="mt-2 text-2xl font-bold">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              connectionsThisYear
            )}
          </div>
        </Card>

        <Card className="p-6">
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

      {/* Downloads Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Downloads</h2>
        <div className="h-[400px]">
          {analyticsLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Downloads Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Download History</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsLoading ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : analyticsData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No downloads yet
                  </TableCell>
                </TableRow>
              ) : (
                analyticsData?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.is_custom_query ? "Custom Query" : item.dataset_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.downloaded_at), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;