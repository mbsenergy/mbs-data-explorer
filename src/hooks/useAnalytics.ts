import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const useAnalytics = (userId: string | undefined) => {
  const { toast } = useToast();

  const { data: lastConnection, isLoading: lastConnectionLoading } = useQuery({
    queryKey: ["lastConnection", userId],
    queryFn: async () => {
      console.log("Fetching last connection for user:", userId);
      const { data, error } = await supabase.rpc('get_last_connection', {
        user_uuid: userId
      });
      if (error) {
        console.error("Last connection error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch last connection data.",
        });
        throw error;
      }
      console.log("Last connection data:", data);
      return data;
    },
    enabled: !!userId,
  });

  const { data: connectionsThisYear, isLoading: connectionsLoading } = useQuery({
    queryKey: ["connectionsThisYear", userId],
    queryFn: async () => {
      console.log("Fetching login count for user:", userId);
      const { data, error } = await supabase.rpc('get_login_count_this_year', {
        user_uuid: userId
      });
      if (error) {
        console.error("Login count error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch login count data.",
        });
        throw error;
      }
      console.log("Login count data:", data);
      return data || 0;
    },
    enabled: !!userId,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", userId],
    queryFn: async () => {
      console.log("Fetching analytics for user:", userId);
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", userId)
        .order("downloaded_at", { ascending: true });
      
      if (error) {
        console.error("Analytics error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch analytics data.",
        });
        throw error;
      }
      console.log("Analytics data:", data);
      return data || [];
    },
    enabled: !!userId,
  });

  const totalDownloads = analyticsData?.length || 0;

  const dailyDownloads = analyticsData?.reduce((acc: Record<string, number>, curr) => {
    const date = format(new Date(curr.downloaded_at), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(dailyDownloads || {}).map(([date, count]) => ({
    date,
    downloads: count,
  }));

  return {
    lastConnection,
    connectionsThisYear,
    analyticsData,
    totalDownloads,
    chartData,
    lastConnectionLoading,
    connectionsLoading,
    analyticsLoading,
  };
};