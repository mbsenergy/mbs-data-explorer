import { DownloadsChart } from "@/components/analytics/DownloadsChart";
import { DownloadsTable } from "@/components/analytics/DownloadsTable";
import { StatsCards } from "@/components/analytics/StatsCards";

const Analytics = () => {
  return (
    <div className="space-y-8">
      <h1>Analytics</h1>
      <StatsCards />
      <DownloadsChart />
      <DownloadsTable />
    </div>
  );
};

export default Analytics;