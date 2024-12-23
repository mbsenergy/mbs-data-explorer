import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { DownloadsChart } from "@/components/analytics/DownloadsChart";
import { DownloadsTable } from "@/components/analytics/DownloadsTable";
import { StatsCards } from "@/components/analytics/StatsCards";

const Analytics = () => {
  const { user } = useAuth();
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch developer analytics data
  const { data: developerData, isLoading: isLoadingDeveloper } = useQuery({
    queryKey: ['developer-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('developer_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch exports data
  const { data: exportsData, isLoading: isLoadingExports } = useQuery({
    queryKey: ['exports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch last connection
  const { data: lastConnection, isLoading: isLoadingLastConnection } = useQuery({
    queryKey: ['last-connection', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .rpc('get_last_connection', { user_uuid: user.id });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch connections this year
  const { data: connectionsThisYear, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connections-this-year', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .rpc('get_login_count_this_year', { user_uuid: user.id });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-8">
      <h1>Analytics</h1>
      <StatsCards 
        lastConnection={lastConnection}
        connectionsThisYear={connectionsThisYear}
        totalDownloads={(analyticsData?.length || 0) + (developerData?.length || 0) + (exportsData?.length || 0)}
        isLoading={{
          lastConnection: isLoadingLastConnection,
          connections: isLoadingConnections,
          analytics: isLoadingAnalytics || isLoadingDeveloper || isLoadingExports
        }}
      />
      <DownloadsChart 
        analyticsData={analyticsData || []}
        developerData={developerData || []}
        exportsData={exportsData || []}
        isLoading={isLoadingAnalytics || isLoadingDeveloper || isLoadingExports}
      />
      <DownloadsTable 
        data={analyticsData || []}
        isLoading={isLoadingAnalytics}
        title="Dataset Downloads"
      />
    </div>
  );
};

export default Analytics;