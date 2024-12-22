import { useAuth } from "@/components/auth/AuthProvider";
import { StatsCards } from "@/components/analytics/StatsCards";
import { DownloadsChart } from "@/components/analytics/DownloadsChart";
import { DownloadsTable } from "@/components/analytics/DownloadsTable";
import { useAnalytics } from "@/hooks/useAnalytics";

const Analytics = () => {
  const { user } = useAuth();
  const {
    lastConnection,
    connectionsThisYear,
    analyticsData,
    totalDownloads,
    chartData,
    lastConnectionLoading,
    connectionsLoading,
    analyticsLoading,
  } = useAnalytics(user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <StatsCards
        lastConnection={lastConnection}
        connectionsThisYear={connectionsThisYear}
        totalDownloads={totalDownloads}
        lastConnectionLoading={lastConnectionLoading}
        connectionsLoading={connectionsLoading}
        analyticsLoading={analyticsLoading}
      />

      <DownloadsChart
        chartData={chartData}
        analyticsLoading={analyticsLoading}
      />

      <DownloadsTable
        analyticsData={analyticsData}
        analyticsLoading={analyticsLoading}
      />
    </div>
  );
};

export default Analytics;