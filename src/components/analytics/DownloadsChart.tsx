import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { subMonths, format, parseISO, isAfter, isBefore, startOfMonth, startOfDay, endOfDay } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addDays } from "date-fns";

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

interface LineConfig {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
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
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  const [lines, setLines] = useState<LineConfig[]>([
    { id: 'downloads', name: 'Dataset Downloads', color: '#10b981', enabled: true },
    { id: 'developer', name: 'Developer Files', color: '#3b82f6', enabled: true },
    { id: 'exports', name: 'Exports', color: '#6366f1', enabled: true },
    { id: 'uploads', name: 'Uploads', color: '#8b5cf6', enabled: true },
    { id: 'queries', name: 'Queries', color: '#ec4899', enabled: true },
    { id: 'chats', name: 'Chat Messages', color: '#f43f5e', enabled: true },
  ]);

  const getMonthlyCount = (data: any[], dateField: string) => {
    const monthlyCounts: { [key: string]: number } = {};
    
    data.forEach(item => {
      const date = parseISO(item[dateField]);
      if (isAfter(startOfDay(date), startOfDay(dateRange.from)) && 
          isBefore(endOfDay(date), endOfDay(dateRange.to))) {
        const monthKey = format(startOfMonth(date), 'MMM yyyy');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });

    return monthlyCounts;
  };

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(dateRange.to, i);
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
    ...(lines.find(l => l.id === 'downloads')?.enabled && { 'Dataset Downloads': analyticsMonthly[month] || 0 }),
    ...(lines.find(l => l.id === 'developer')?.enabled && { 'Developer Files': developerMonthly[month] || 0 }),
    ...(lines.find(l => l.id === 'exports')?.enabled && { 'Exports': exportsMonthly[month] || 0 }),
    ...(lines.find(l => l.id === 'uploads')?.enabled && { 'Uploads': storageMonthly[month] || 0 }),
    ...(lines.find(l => l.id === 'queries')?.enabled && { 'Queries': queryMonthly[month] || 0 }),
    ...(lines.find(l => l.id === 'chats')?.enabled && { 'Chat Messages': chatMonthly[month] || 0 }),
  }));

  const toggleLine = (lineId: string) => {
    setLines(prev => prev.map(line => 
      line.id === lineId ? { ...line, enabled: !line.enabled } : line
    ));
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[350px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <DatePickerWithRange
          date={dateRange}
          onDateChange={setDateRange}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {lines.map(line => (
            <div key={line.id} className="flex items-center space-x-2">
              <Checkbox
                id={line.id}
                checked={line.enabled}
                onCheckedChange={() => toggleLine(line.id)}
              />
              <Label
                htmlFor={line.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {line.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            {lines.map(line => line.enabled && (
              <Line
                key={line.id}
                type="monotone"
                dataKey={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};