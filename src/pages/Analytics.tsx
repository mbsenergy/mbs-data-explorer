import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Analytics = () => {
  const [selectedCountry, setSelectedCountry] = useState("IT");

  const { data: employmentData, isLoading: employmentLoading } = useQuery({
    queryKey: ["employment", selectedCountry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_employment")
        .select("*")
        .eq("COUNTRY", selectedCountry)
        .order("DATE", { ascending: true })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_employment")
        .select("COUNTRY")
        .distinct();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Card className="p-6 glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Employment Analysis</h2>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country) => (
                <SelectItem key={country.COUNTRY} value={country.COUNTRY}>
                  {country.COUNTRY}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {employmentLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <ChartContainer className="h-[400px]" config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DATE" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="VALUE" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </Card>
    </div>
  );
};

export default Analytics;