import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
  gdp: {
    label: "GDP",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
  employment: {
    label: "Employment Rate",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
  energy: {
    label: "Energy Price",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
  generation: {
    label: "Generation",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
};

export const MarketOverview = () => {
  const { toast } = useToast();

  // Economics Row Queries
  const { data: gdpData, isLoading: gdpLoading } = useQuery({
    queryKey: ["gdp"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_gdp_main_components")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  const { data: employmentData, isLoading: employmentLoading } = useQuery({
    queryKey: ["employment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_employment")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  // Energy Spot Prices Row Queries
  const { data: energyPricesIT, isLoading: pricesITLoading } = useQuery({
    queryKey: ["energy-prices-it"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ME01_gme_mgp_prices")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(336); // 14 days * 24 hours
      if (error) throw error;
      return data;
    },
  });

  const { data: energyPricesEU, isLoading: pricesEULoading } = useQuery({
    queryKey: ["energy-prices-eu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("TS01_entsoe_dam_prices")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  // Main Commodities Row Queries
  // Note: Add queries for commodities data when available

  // Fundamentals Row Queries
  const { data: energyGeneration, isLoading: generationLoading } = useQuery({
    queryKey: ["energy-generation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("TS01_entsoe_actual_generation")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (tableName: string, data: any[]) => {
    if (!data?.length) return;

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Data downloaded successfully",
    });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Market Overview</h2>
      
      {/* Economics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">GDP by Country</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('gdp', gdpData)}
              disabled={!gdpData?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {gdpLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={gdpData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="VALUE" 
                    name="gdp"
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Employment by Country</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('employment', employmentData)}
              disabled={!employmentData?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {employmentLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={employmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="VALUE" 
                    name="employment"
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>
      </div>

      {/* Energy Spot Prices Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Energy Prices in Italy by Zone</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('energy-prices-it', energyPricesIT)}
              disabled={!energyPricesIT?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {pricesITLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={energyPricesIT}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="VALUE" 
                    name="energy"
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Energy Prices in Europe</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('energy-prices-eu', energyPricesEU)}
              disabled={!energyPricesEU?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {pricesEULoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={energyPricesEU}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="VALUE" 
                    name="energy"
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>
      </div>

      {/* Main Commodities Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Main Commodities (Monthly)</h3>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Main Commodities (Hourly)</h3>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </Card>
      </div>

      {/* Fundamentals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Energy Generation in Europe</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('energy-generation', energyGeneration)}
              disabled={!energyGeneration?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {generationLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={energyGeneration}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="VALUE" 
                    name="generation"
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Scenario Projections</h3>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
};