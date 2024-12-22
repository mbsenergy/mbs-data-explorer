import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { StatsCards } from "@/components/analytics/StatsCards";
import { DownloadsChart } from "@/components/analytics/DownloadsChart";
import { DownloadsTable } from "@/components/analytics/DownloadsTable";

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_cerved")
        .eq("id", user?.id)
        .single();
      
      if (error) {
        console.error("Profile error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile data.",
        });
        throw error;
      }
      return data;
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

      return data.map(item => ({
        ...item,
        profiles: { is_cerved: profile?.is_cerved }
      }));
    },
    enabled: !!user?.id && !!profile,
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

  // Helper function to determine dataset type and tags
  const getDatasetInfo = (datasetName: string) => {
    const type = datasetName.split('_')[0] || 'Unknown';
    const tags = [];
    
    if (datasetName.includes('electricity')) tags.push('Electricity');
    if (datasetName.includes('gas')) tags.push('Gas');
    if (datasetName.includes('price')) tags.push('Price');
    if (datasetName.includes('production')) tags.push('Production');
    if (datasetName.includes('efficiency')) tags.push('Efficiency');
    if (datasetName.includes('employment')) tags.push('Employment');
    if (datasetName.includes('gdp')) tags.push('GDP');
    
    return { type, tags };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <StatsCards
        lastConnection={lastConnection}
        connectionsThisYear={connectionsThisYear}
        totalDownloads={(analyticsData?.length || 0) + (developerAnalytics?.length || 0)}
        isLoading={{
          lastConnection: lastConnectionLoading,
          connections: connectionsLoading,
          analytics: analyticsLoading || developerAnalyticsLoading
        }}
      />

      <DownloadsChart 
        data={analyticsData || []} 
        isLoading={analyticsLoading}
      />

      <DownloadsTable
        title="Dataset Download History"
        data={analyticsData || []}
        isLoading={analyticsLoading}
        getDatasetInfo={getDatasetInfo}
      />

      <DownloadsTable
        title="Developer Resources Download History"
        data={developerAnalytics || []}
        isLoading={developerAnalyticsLoading}
      />
    </div>
  );
};

export default Analytics;