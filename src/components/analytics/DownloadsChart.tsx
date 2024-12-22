import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface DownloadsChartProps {
  analyticsData: any[];
  developerData: any[];
  exportsData: any[];
  isLoading: boolean;
}

export const DownloadsChart = ({ 
  analyticsData, 
  developerData,
  exportsData,
  isLoading 
}: DownloadsChartProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const chartData = Object.entries(
    [...analyticsData, ...developerData, ...exportsData]
    .reduce((acc: Record<string, any>, curr) => {
      const date = format(new Date(curr.downloaded_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          'Dataset Samples': 0,
          'Developer Files': 0,
          'Dataset Exports': 0
        };
      }
      
      // Determine the type of download and increment the appropriate counter
      if ('dataset_name' in curr) {
        acc[date]['Dataset Samples']++;
      } else if ('file_name' in curr) {
        acc[date]['Developer Files']++;
      } else if ('export_name' in curr) {
        acc[date]['Dataset Exports']++;
      }
      
      return acc;
    }, {}),
  ).map(([date, counts]) => ({
    date,
    ...counts
  }));

  return (
    <Card className="p-6 bg-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daily Downloads</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="h-[400px]">
            {isLoading ? (
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Dataset Samples"
                    stroke="#57D7E2"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Developer Files"
                    stroke="#FEC6A1"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Dataset Exports"
                    stroke="#A78BFA"
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};