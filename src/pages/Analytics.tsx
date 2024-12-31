import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { StatsCards } from "@/components/analytics/StatsCards";
import { DownloadsChart } from "@/components/analytics/DownloadsChart";
import { AnalyticsTables } from "@/components/analytics/AnalyticsTables";

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: lastConnection, isLoading: lastConnectionLoading } = useQuery({
    queryKey: ["lastConnection", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_last_connection', {
        user_uuid: user?.id
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
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: connectionsThisYear, isLoading: connectionsLoading } = useQuery({
    queryKey: ["connectionsThisYear", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_login_count_this_year', {
        user_uuid: user?.id
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
      return data || 0;
    },
    enabled: !!user?.id,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_custom_query", false)
        .order("downloaded_at", { ascending: false });
      
      if (error) {
        console.error("Analytics error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch analytics data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: ["queries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_custom_query", true)
        .order("downloaded_at", { ascending: false });
      
      if (error) {
        console.error("Query analytics error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch query analytics data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: developerAnalytics, isLoading: developerAnalyticsLoading } = useQuery({
    queryKey: ["developerAnalytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_analytics")
        .select("*")
        .eq("user_id", user?.id)
        .order("downloaded_at", { ascending: false });
      
      if (error) {
        console.error("Developer analytics error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch developer analytics data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: exportsData, isLoading: exportsLoading } = useQuery({
    queryKey: ["exports", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exports")
        .select("*")
        .eq("user_id", user?.id)
        .order("downloaded_at", { ascending: false });
      
      if (error) {
        console.error("Exports error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch exports data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: storageData, isLoading: storageLoading } = useQuery({
    queryKey: ["storage", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storage_files")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Storage error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch storage data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ["chatAnalytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_analytics")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Chat analytics error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch chat analytics data.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-500">
        Analytics
      </h1>

      <StatsCards
        lastConnection={lastConnection}
        connectionsThisYear={connectionsThisYear}
        totalDownloads={
          (analyticsData?.length || 0) + 
          (developerAnalytics?.length || 0) + 
          (exportsData?.length || 0) +
          (storageData?.length || 0)
        }
        totalChats={chatData?.length || 0}
        isLoading={{
          lastConnection: lastConnectionLoading,
          connections: connectionsLoading,
          analytics: analyticsLoading || developerAnalyticsLoading || exportsLoading || storageLoading,
          chat: chatLoading
        }}
      />

      <DownloadsChart 
        analyticsData={analyticsData || []}
        developerData={developerAnalytics || []}
        exportsData={exportsData || []}
        storageData={storageData || []}
        queryData={queryData || []}
        chatData={chatData || []}
        isLoading={analyticsLoading || developerAnalyticsLoading || exportsLoading || storageLoading || queryLoading || chatLoading}
      />

      <AnalyticsTables
        analyticsData={analyticsData || []}
        developerData={developerAnalytics || []}
        exportsData={exportsData || []}
        storageData={storageData || []}
        queryData={queryData || []}
        chatData={chatData || []}
        isLoading={{
          analytics: analyticsLoading,
          developer: developerAnalyticsLoading,
          exports: exportsLoading,
          storage: storageLoading,
          queries: queryLoading,
          chat: chatLoading
        }}
      />
    </div>
  );
};

export default Analytics;