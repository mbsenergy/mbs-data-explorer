import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { subMonths, format, parseISO, isAfter, isBefore, startOfMonth, startOfDay, endOfDay } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangeSelector } from "./DateRangeSelector";
import { LineToggleList } from "./LineToggleList";
import { DownloadsChartProps, LineConfig } from "./types";

export const DownloadsChart = ({
  analyticsData,
  developerData,
  exportsData,
  storageData,
  queryData,
  chatData,
  isLoading
}: DownloadsChartProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
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
      if (dateRange.from && dateRange.to &&
          isAfter(startOfDay(date), startOfDay(dateRange.from)) && 
          isBefore(endOfDay(date), endOfDay(dateRange.to))) {
        const monthKey = format(startOfMonth(date), 'MMM yyyy');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });

    return monthlyCounts;
  };

  const months = dateRange.from && dateRange.to ? 
    Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(dateRange.to, i);
      return format(d, 'MMM yyyy');
    }).reverse() : [];

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

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange?.from) {
      setDateRange({
        from: newDateRange.from,
        to: newDateRange.to || newDateRange.from
      });
    }
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
        <DateRangeSelector
          dateRange={dateRange}
          onDateChange={handleDateRangeChange}
        />
        <LineToggleList
          lines={lines}
          onToggle={toggleLine}
        />
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