import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ColumnDistributionChartProps {
  distribution: Record<string, number>;
  type: string;
}

export const ColumnDistributionChart = ({ distribution, type }: ColumnDistributionChartProps) => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: type === 'number' ? 'column' : 'pie',
      height: 200,
      backgroundColor: 'transparent'
    },
    title: { text: undefined },
    xAxis: type === 'number' ? {
      categories: Object.keys(distribution),
      labels: { rotation: -45 }
    } : undefined,
    yAxis: type === 'number' ? {
      title: { text: 'Count' }
    } : undefined,
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Distribution',
      type: type === 'number' ? 'column' : 'pie',
      data: type === 'number' 
        ? Object.values(distribution)
        : Object.entries(distribution).map(([name, y]) => ({ name, y }))
    }],
    credits: { enabled: false }
  };

  return (
    <div className="h-[200px]">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};