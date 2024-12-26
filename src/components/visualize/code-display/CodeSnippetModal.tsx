import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  plotData: any;
}

export const CodeSnippetModal = ({
  isOpen,
  onClose,
  plotData,
}: CodeSnippetModalProps) => {
  const { toast } = useToast();

  const reactCode = `import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = ${JSON.stringify(plotData, null, 2)};

const Chart = () => (
  <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
);`;

  const pythonCode = `import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Assuming your data is in a pandas DataFrame
options = ${JSON.stringify(plotData, null, 2)}

# Create figure
fig = go.Figure()

# Add traces based on series data
for series in options['series']:
    fig.add_trace(
        go.Scatter(
            x=[point[0] for point in series['data']],
            y=[point[1] for point in series['data']],
            name=series['name'],
            mode='lines+markers'
        )
    )

# Update layout
fig.update_layout(
    title=options['title']['text'],
    xaxis_title=options['xAxis']['title']['text'],
    yaxis_title=options['yAxis']['title']['text'],
    template='plotly_dark'
)

fig.show()`;

  // Generate R code with proper structure
  const generateRCode = (options: any) => {
    const seriesData = options.series.map((series: any, index: number) => {
      const data = JSON.stringify(series.data || []);
      return `  hc %>%
    hc_add_series(
      name = "${series.name || `Series ${index + 1}`}",
      data = ${data}
    )`;
    }).join('\n');

    return `library(highcharter)

# Create the base chart
hc <- highchart() %>%
  hc_chart(type = "${options.chart?.type || 'line'}") %>%
  hc_title(text = "${options.title?.text || ''}") %>%
  hc_xAxis(
    title = list(text = "${options.xAxis?.title?.text || ''}"),
    type = "${options.xAxis?.type || 'linear'}"
  ) %>%
  hc_yAxis(
    title = list(text = "${options.yAxis?.title?.text || ''}"),
    type = "${options.yAxis?.type || 'linear'}"
  )

# Add series data
${seriesData}

# Add legend configuration
hc %>%
  hc_legend(
    enabled = ${options.legend?.enabled !== false},
    align = "${options.legend?.align || 'center'}",
    verticalAlign = "${options.legend?.verticalAlign || 'bottom'}",
    layout = "${options.legend?.layout || 'horizontal'}"
  )

# Display the chart
hc`;
  };

  const rCode = generateRCode(plotData);

  const handleCopy = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Success",
        description: `${language} code copied to clipboard`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy code",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd9e8] to-[#4DC3D7] text-2xl font-bold">
            Chart Code
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="react" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="r">R</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <TabsContent value="react">
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(reactCode, "React")}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy React Code
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {reactCode}
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(pythonCode, "Python")}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Python Code
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {pythonCode}
              </pre>
            </TabsContent>

            <TabsContent value="r">
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(rCode, "R")}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy R Code
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {rCode}
              </pre>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};