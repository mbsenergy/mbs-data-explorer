import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-corporate-navy via-corporate-navy/95 to-corporate-blue/90">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <FeatureCard
            icon={<Database className="h-8 w-8 text-corporate-teal" />}
            title="Comprehensive Datasets"
            description="Access a wide range of energy market datasets, from prices to consumption patterns"
          />
          
          <FeatureCard
            icon={<BarChart2 className="h-8 w-8 text-corporate-teal" />}
            title="Advanced Analytics"
            description="Powerful analytics tools for data visualization and market insights"
          />
          
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-corporate-teal" />}
            title="Scenario Analysis"
            description="Create and analyze different market scenarios with our advanced tools"
          />
          
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-corporate-teal" />}
            title="AI Assistant"
            description="Get help from FluxerBuddy, our AI assistant for data analysis and queries"
          />
          
          <FeatureCard
            icon={<Code className="h-8 w-8 text-corporate-teal" />}
            title="Developer Tools"
            description="Access APIs, documentation, and developer resources"
          />
          
          <FeatureCard
            icon={<LineChart className="h-8 w-8 text-corporate-teal" />}
            title="Data Wrangling"
            description="Transform and analyze data with our powerful wrangling tools"
          />
          
          <FeatureCard
            icon={<Eye className="h-8 w-8 text-corporate-teal" />}
            title="Osservatorio"
            description="Stay updated with the latest energy market observations and trends"
          />
          
          <FeatureCard
            icon={<Building2 className="h-8 w-8 text-corporate-teal" />}
            title="Company Products"
            description="Explore our suite of professional energy market solutions"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">
          © 2025 MBS Consulting. All rights reserved. <span className="text-corporate-teal">AI Powered</span>.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="p-6 metallic-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/[0.03]">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full p-3 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/10 mb-4">
          {icon}
        </div>
        <h3 className="mt-2 mb-2 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {title}
        </h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </Card>
  );
};

export default Landing;