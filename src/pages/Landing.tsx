import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  BarChart2,
  Database,
  FileText,
  MessageSquare,
  Code,
  LineChart,
  Eye,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface FeatureDetails {
  title: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  to: string;
}

const features: FeatureDetails[] = [
  {
    to: "/scenario",
    title: "Scenario",
    description: "Access our scenario analysis and forecasting tools",
    longDescription: "Our advanced scenario analysis tools enable you to create, analyze, and compare different market scenarios. Features include:\n\n• Custom scenario creation with multiple variables\n• Advanced forecasting algorithms\n• Comparative analysis tools\n• Historical data integration\n• Export capabilities for reports and presentations\n• Real-time updates and calculations",
    icon: <LineChart className="h-8 w-8 text-corporate-teal" />
  },
  {
    to: "/osservatorio",
    title: "Osservatorio",
    description: "Explore energy market insights and analysis",
    longDescription: "The Osservatorio provides comprehensive energy market insights and analysis through:\n\n• Real-time market monitoring\n• Detailed trend analysis\n• Expert commentary and reports\n• Interactive data visualizations\n• Regular market updates\n• Custom alert settings for market changes",
    icon: <Eye className="h-8 w-8 text-corporate-teal" />
  },
  {
    to: "/datasets",
    title: "Datasets",
    description: "Browse and download our comprehensive datasets",
    longDescription: "Access our extensive collection of energy market datasets including:\n\n• Historical price data\n• Consumption patterns\n• Production statistics\n• Market indicators\n• Custom query builder\n• Multiple export formats\n• API access for integration",
    icon: <Database className="h-8 w-8 text-corporate-teal" />
  },
  {
    to: "/company",
    title: "Company Products",
    description: "Discover our suite of professional solutions",
    longDescription: "Explore our comprehensive suite of professional energy market solutions:\n\n• Enterprise-grade analytics tools\n• Custom reporting solutions\n• Integration services\n• Professional consulting\n• Training and support\n• Dedicated account management",
    icon: <Building2 className="h-8 w-8 text-corporate-teal" />
  }
];

const Landing = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetails | null>(null);

  return (
    <div className="min-h-screen relative bg-corporate-navy">
      {/* Background pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img 
              src="/brand/flux_logo_01.png" 
              alt="Flux Logo" 
              className="h-16 md:h-20"
            />
          </div>

          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-corporate-teal via-cyan-400 to-blue-400">
              Flux Data Platform
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your comprehensive solution for energy market data analysis and visualization, powered by advanced analytics and AI
            </p>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-corporate-teal to-corporate-teal/80 hover:from-corporate-teal/90 hover:to-corporate-teal/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {features.map((feature) => (
              <div key={feature.to} className="flex flex-col flex-1">
                <Card 
                  className="p-6 h-full hover:bg-muted/50 transition-colors cursor-pointer metallic-card transform hover:-translate-y-1 duration-300"
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">
                      {feature.title}
                    </h3>
                    {feature.icon}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2025 MBS Consulting. All rights reserved. <span className="text-corporate-teal">AI Powered</span>.
          </p>
        </footer>
      </div>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="metallic-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedFeature?.icon}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">
                {selectedFeature?.title}
              </span>
            </DialogTitle>
            <DialogDescription className="text-left whitespace-pre-line pt-4">
              {selectedFeature?.longDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Link to={selectedFeature?.to || "/"}>
              <Button className="bg-gradient-to-r from-corporate-teal to-corporate-teal/80 hover:from-corporate-teal/90 hover:to-corporate-teal/70 text-white">
                Explore {selectedFeature?.title}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;