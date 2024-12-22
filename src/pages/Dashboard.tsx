import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Dashboard = () => {
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

  const { data: energyPricesIT, isLoading: pricesITLoading } = useQuery({
    queryKey: ["energy-prices-it"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ME01_gme_mgp_prices")
        .select("*")
        .order("DATE", { ascending: true })
        .limit(14);
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Economics Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Economics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">GDP by Country</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            {gdpLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={gdpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DATE" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="VALUE" stroke="var(--primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Employment by Country</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            {employmentLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={employmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DATE" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="VALUE" stroke="var(--primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </Card>
        </div>
      </div>

      {/* Energy Spot Prices Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Energy Spot Prices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Italian Zonal Prices</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            {pricesITLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={energyPricesIT}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DATE" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="VALUE" stroke="var(--primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">European Prices</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            {pricesEULoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={energyPricesEU}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DATE" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="VALUE" stroke="var(--primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </Card>
        </div>
      </div>

      {/* Fundamentals Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Fundamentals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Energy Generation in Europe</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            {generationLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={energyGeneration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DATE" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="VALUE" stroke="var(--primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scenario Projections</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              Coming soon...
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;