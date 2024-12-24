import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ChartDataItem {
  date: string;
  'Dataset Samples': number;
  'Developer Files': number;
  'Dataset Exports': number;
}

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
  
  const chartData: ChartDataItem[] = Object.entries(
    [...(analyticsData || []), ...(developerData || []), ...(exportsData || [])]
    .reduce((acc: Record<string, ChartDataItem>, curr) => {
      const date = new Date(curr.downloaded_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          'Dataset Samples': 0,
          'Developer Files': 0,
          'Dataset Exports': 0
        };
      }
      
      if ('dataset_name' in curr) {
        acc[date]['Dataset Samples']++;
      } else if ('file_name' in curr) {
        acc[date]['Developer Files']++;
      } else if ('export_name' in curr) {
        acc[date]['Dataset Exports']++;
      }
      
      return acc;
    }, {} as Record<string, ChartDataItem>)
  ).map(([date, counts]) => ({
    date,
    'Dataset Samples': counts['Dataset Samples'],
    'Developer Files': counts['Developer Files'],
    'Dataset Exports': counts['Dataset Exports']
  }));

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 500,
    },
    title: {
      text: undefined
    },
    xAxis: {
      labels: {
        rotation: -45,
        style: {
          fontSize: '10px'
        }
      }
    },
    yAxis: {
      categories: chartData.map(item => item.date),
      title: {
        text: 'Number of Downloads'
      },
      allowDecimals: false
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          color: '#ffffff'
        }
      }
    },
    series: [{
      name: 'Dataset Samples',
      type: 'bar',
      data: chartData.map(item => item['Dataset Samples']),
      color: '#57D7E2'
    }, {
      name: 'Developer Files',
      type: 'bar',
      data: chartData.map(item => item['Developer Files']),
      color: '#FEC6A1'
    }, {
      name: 'Dataset Exports',
      type: 'bar',
      data: chartData.map(item => item['Dataset Exports']),
      color: '#A78BFA'
    }],
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: '#fff'
      }
    },
    credits: {
      enabled: false
    }
  };

  return (
    <Card className="p-6 bg-card metallic-card">
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
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
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