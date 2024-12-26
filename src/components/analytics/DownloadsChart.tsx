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
  'File Uploads': number;
  'Query Executions': number;
}

interface DownloadsChartProps {
  analyticsData: any[];
  developerData: any[];
  exportsData: any[];
  storageData: any[];
  queryData: any[];
  isLoading: boolean;
}

export const DownloadsChart = ({ 
  analyticsData, 
  developerData,
  exportsData,
  storageData,
  queryData,
  isLoading 
}: DownloadsChartProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const chartData: ChartDataItem[] = Object.entries(
    [...(analyticsData || []), 
     ...(developerData || []), 
     ...(exportsData || []),
     ...(storageData || []),
     ...(queryData || [])]
    .reduce((acc: Record<string, ChartDataItem>, curr) => {
      const date = new Date(curr.downloaded_at || curr.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          'Dataset Samples': 0,
          'Developer Files': 0,
          'Dataset Exports': 0,
          'File Uploads': 0,
          'Query Executions': 0
        };
      }
      
      if ('dataset_name' in curr) {
        if (curr.is_custom_query) {
          acc[date]['Query Executions']++;
        } else {
          acc[date]['Dataset Samples']++;
        }
      } else if ('file_name' in curr) {
        acc[date]['Developer Files']++;
      } else if ('export_name' in curr) {
        acc[date]['Dataset Exports']++;
      } else if ('storage_id' in curr) {
        acc[date]['File Uploads']++;
      }
      
      return acc;
    }, {} as Record<string, ChartDataItem>)
  )
  .map(([date, counts]) => ({
    date,
    'Dataset Samples': counts['Dataset Samples'],
    'Developer Files': counts['Developer Files'],
    'Dataset Exports': counts['Dataset Exports'],
    'File Uploads': counts['File Uploads'],
    'Query Executions': counts['Query Executions']
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 500,
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: chartData.map(item => item.date),
      labels: {
        rotation: -45,
        style: {
          fontSize: '10px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Number of Actions'
      },
      allowDecimals: false
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        borderRadius: 4,
        borderWidth: 0, // Remove white borders
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
    }, {
      name: 'File Uploads',
      type: 'bar',
      data: chartData.map(item => item['File Uploads']),
      color: '#34D399'
    }, {
      name: 'Query Executions',
      type: 'bar',
      data: chartData.map(item => item['Query Executions']),
      color: '#F472B6'
    }],
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: '#fff',
        fontWeight: '400'
      },
      itemHoverStyle: {
        color: '#ccc'
      },
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 20,
      margin: 20
    },
    credits: {
      enabled: false
    }
  };

  return (
    <Card className="p-6 bg-card metallic-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daily Activity</h2>
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
                No activity data available
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};