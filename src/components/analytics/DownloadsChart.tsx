import { Card } from "@/components/ui/card";
import { Line } from "recharts";
import { LineChart } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { subMonths, format, parseISO, isAfter, isBefore, startOfMonth } from "date-fns";

interface DownloadsChartProps {
  analyticsData: {
    created_at: string;
    dataset_name: string;
    downloaded_at: string;
    id: string;
    is_custom_query: boolean;
    user_id: string;
  }[];
  developerData: {
    created_at: string;
    downloaded_at: string;
    file_name: string;
    file_section: string;
    id: string;
    user_id: string;
  }[];
  exportsData: {
    created_at: string;
    downloaded_at: string;
    export_name: string;
    export_type: string;
    id: string;
    user_id: string;
  }[];
  storageData: {
    created_at: string;
    id: string;
    original_name: string;
    storage_id: string;
    tags: string[] | null;
    user_id: string;
  }[];
  queryData: {
    created_at: string;
    dataset_name: string;
    downloaded_at: string;
    id: string;
    is_custom_query: boolean;
    user_id: string;
  }[];
  chatData: {
    created_at: string;
    id: string;
    message_content: string;
    user_id: string;
  }[];
  isLoading: boolean;
}

export const DownloadsChart = ({
  analyticsData,
  developerData,
  exportsData,
  storageData,
  queryData,
  chatData,
  isLoading
}: DownloadsChartProps) => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  const getMonthlyCount = (data: any[], dateField: string) => {
    const monthlyCounts: { [key: string]: number } = {};
    
    data.forEach(item => {
      const date = parseISO(item[dateField]);
      if (isAfter(date, sixMonthsAgo) && isBefore(date, now)) {
        const monthKey = format(startOfMonth(date), 'MMM yyyy');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });

    return monthlyCounts;
  };

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, i);
    return format(d, 'MMM yyyy');
  }).reverse();

  const analyticsMonthly = getMonthlyCount(analyticsData, 'downloaded_at');
  const developerMonthly = getMonthlyCount(developerData, 'downloaded_at');
  const exportsMonthly = getMonthlyCount(exportsData, 'downloaded_at');
  const storageMonthly = getMonthlyCount(storageData, 'created_at');
  const queryMonthly = getMonthlyCount(queryData, 'downloaded_at');
  const chatMonthly = getMonthlyCount(chatData, 'created_at');

  const chartData = months.map(month => ({
    name: month,
    'Dataset Downloads': analyticsMonthly[month] || 0,
    'Developer Files': developerMonthly[month] || 0,
    'Exports': exportsMonthly[month] || 0,
    'Uploads': storageMonthly[month] || 0,
    'Queries': queryMonthly[month] || 0,
    'Chat Messages': chatMonthly[month] || 0,
  }));

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[350px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="h-[350px] w-full">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="Dataset Downloads" 
            stroke="#10b981" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="Developer Files" 
            stroke="#3b82f6" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="Exports" 
            stroke="#6366f1" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="Uploads" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="Queries" 
            stroke="#ec4899" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="Chat Messages" 
            stroke="#f43f5e" 
            strokeWidth={2} 
          />
        </LineChart>
      </div>
    </Card>
  );
};