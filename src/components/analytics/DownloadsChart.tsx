import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DownloadsChartProps {
  chartData: Array<{ date: string; downloads: number }>;
  analyticsLoading: boolean;
}

export const DownloadsChart = ({ chartData, analyticsLoading }: DownloadsChartProps) => {
  return (
    <Card className="p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Daily Downloads</h2>
      <div className="h-[400px]">
        {analyticsLoading ? (
          <Skeleton className="w-full h-full" />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fill: '#ffffff' }}
              />
              <YAxis 
                tick={{ fill: '#ffffff' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="#57D7E2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No download data available
          </div>
        )}
      </div>
    </Card>
  );
};