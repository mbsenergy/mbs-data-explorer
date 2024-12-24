import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const links = [
  {
    to: "/scenario",
    title: "Scenario",
    description: "Access our scenario analysis and forecasting tools"
  },
  {
    to: "/osservatorio",
    title: "Osservatorio",
    description: "Explore energy market insights and analysis"
  },
  {
    to: "/datasets",
    title: "Datasets",
    description: "Browse and download our comprehensive datasets"
  },
  {
    to: "/company",
    title: "Company Products",
    description: "Discover our suite of professional solutions"
  }
];

export const KnowMoreSection = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Know More</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {links.map((link) => (
          <div key={link.to} className="flex flex-col flex-1">
            <Link to={link.to} className="h-full">
              <Card className="p-6 h-full hover:bg-muted/50 transition-colors cursor-pointer metallic-card">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">{link.title}</h3>
                  <ArrowRight className="h-5 w-5" />
                </div>
                <p className="text-muted-foreground mt-2">
                  {link.description}
                </p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};