import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Guide = () => {
  const { toast } = useToast();

  const handleMailClick = () => {
    // Open default mail client with pre-filled subject
    window.location.href = "mailto:support@fluxdataplatform.com?subject=Flux Data Platform Support Request";
    toast({
      title: "Opening mail client",
      description: "Your default mail client should open shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">Guide</h1>
        <Button 
          onClick={handleMailClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <Card className="p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Overview</h3>
            <p>
              Welcome to the Flux Data Platform! This platform provides comprehensive access to various datasets and analytical tools:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Economics Data:</strong> Access GDP and employment statistics by country with yearly/monthly granularity.</li>
              <li><strong>Energy Market Analysis:</strong> View energy prices across Italian zones and European markets.</li>
              <li><strong>Commodities Tracking:</strong> Monitor daily and hourly commodities price movements.</li>
              <li><strong>Energy Generation:</strong> Analyze European energy generation data and explore scenario projections.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Interactive Visualizations:</strong> Explore data through dynamic charts and graphs.</li>
              <li><strong>Data Downloads:</strong> Export filtered datasets for further analysis.</li>
              <li><strong>Scenario Analysis:</strong> Access projections for prices, demand, and production types.</li>
              <li><strong>Developer Tools:</strong> Utilize R and Python scripts for advanced analysis.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Getting Started</h3>
            <p>
              To begin using the platform:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to the Datasets section to explore available data.</li>
              <li>Use the filtering options to narrow down your search.</li>
              <li>Download filtered datasets for offline analysis.</li>
              <li>Check the Developer section for available analysis scripts.</li>
            </ol>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Guide;