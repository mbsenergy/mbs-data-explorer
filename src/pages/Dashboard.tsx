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

  const { data: energyPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ["energy-prices"],
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

  const { data: energyProduction, isLoading: productionLoading } = useQuery({
    queryKey: ["energy-production"],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-4">GDP Overview</h3>
          {gdpLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="VALUE"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-4">Energy Prices</h3>
          {pricesLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyPrices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="VALUE"
                    stroke="var(--secondary)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>

        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-4">Energy Production</h3>
          {productionLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ChartContainer className="h-[200px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="VALUE"
                    stroke="var(--accent)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;