import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const [selectedCountry, setSelectedCountry] = useState("IT");

  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_employment")
        .select("COUNTRY")
        .in("COUNTRY", ["IT", "FR", "DE", "ES", "UK"]);

      if (error) throw error;
      return data;
    },
  });

  const { data: employmentData, isLoading: dataLoading } = useQuery({
    queryKey: ["employment", selectedCountry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EC01_eurostat_employment")
        .select("*")
        .eq("COUNTRY", selectedCountry)
        .order("DATE", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const uniqueCountries = Array.from(
    new Set(countries?.map((c) => c.COUNTRY) || [])
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Card className="p-6 glass-panel">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Employment Analysis</h2>
            <Select
              value={selectedCountry}
              onValueChange={(value) => setSelectedCountry(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px]">
            {dataLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={employmentData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="DATE" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="VALUE"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;