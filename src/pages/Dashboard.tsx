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
import { Download, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

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

const Dashboard = () => {
  const { toast } = useToast();

  // Fetch latest documents from storage with public URLs
  const { data: latestDocs, isLoading: docsLoading } = useQuery({
    queryKey: ["latest-docs"],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .storage
        .from('latest')
        .list('', {
          limit: 10,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      // Filter for image and PDF files
      return files?.filter(file => 
        file.name.toLowerCase().endsWith('.png') || 
        file.name.toLowerCase().endsWith('.jpg') ||
        file.name.toLowerCase().endsWith('.jpeg') ||
        file.name.toLowerCase().endsWith('.pdf')
      ) || [];
    },
  });

  // Existing data fetching queries
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Latest Documents Carousel */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Latest Documents</h2>
        <Card className="p-6">
          {docsLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : latestDocs?.length ? (
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {latestDocs.map((file) => (
                  <CarouselItem key={file.id}>
                    <div className="p-1">
                      <Card className="p-4">
                        <img
                          src={`${supabase.storage.from('latest').getPublicUrl(file.name).data.publicUrl}`}
                          alt={file.name}
                          className="w-full h-[300px] object-contain"
                        />
                        <p className="mt-2 text-center text-sm text-muted-foreground">{file.name}</p>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className="text-center text-muted-foreground">No documents available</p>
          )}
        </Card>
      </div>

      {/* Market Overview Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Market Overview</h2>
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
      </div>

      {/* Know More Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Know More</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/scenario">
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Scenario</h3>
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-muted-foreground mt-2">
                Access our scenario analysis and forecasting tools
              </p>
            </Card>
          </Link>
          
          <Link to="/osservatorio">
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Osservatorio</h3>
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-muted-foreground mt-2">
                Explore energy market insights and analysis
              </p>
            </Card>
          </Link>

          <Link to="/datasets">
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Datasets</h3>
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-muted-foreground mt-2">
                Browse and download our comprehensive datasets
              </p>
            </Card>
          </Link>

          <Link to="/company">
            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Company Products</h3>
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-muted-foreground mt-2">
                Discover our suite of professional solutions
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
