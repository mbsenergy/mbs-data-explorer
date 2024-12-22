import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ServiceBox = ({ title }: { title: string }) => (
  <div className="p-4 bg-muted rounded-lg">
    <h4 className="font-medium">{title}</h4>
  </div>
);

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company</h1>
      
      <div className="grid gap-6">
        <Card className="p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">Energy Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ServiceBox title="Strategy & Asset Valuation" />
            <ServiceBox title="Osservatorio energia" />
            <ServiceBox title="Scenario" />
            <ServiceBox title="Data & Modelling" />
            <ServiceBox title="Due Dilligence" />
            <ServiceBox title="PPA" />
          </div>
          <Button variant="outline" asChild>
            <a 
              href="https://www.example.com/energy-services" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Learn More <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <Card className="p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">MBS Consulting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ServiceBox title="Insurance" />
            <ServiceBox title="Banking" />
            <ServiceBox title="Energy" />
            <ServiceBox title="Risk Advisory" />
            <ServiceBox title="Financial Services" />
            <ServiceBox title="Innovation Team" />
            <ServiceBox title="Public Administration" />
            <ServiceBox title="EGS" />
            <ServiceBox title="More" />
          </div>
          <Button variant="outline" asChild>
            <a 
              href="https://www.example.com/mbs-consulting" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Learn More <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <Card className="p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">Cerved Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ServiceBox title="Cerved" />
            <ServiceBox title="Rating Agency" />
            <ServiceBox title="Data & AI" />
            <ServiceBox title="Spazio Dati" />
            <ServiceBox title="ProWeb" />
          </div>
          <Button variant="outline" asChild>
            <a 
              href="https://www.example.com/cerved-group" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Learn More <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <Card className="p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">ION Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ServiceBox title="Market Analytics" />
            <ServiceBox title="Core Banking" />
            <ServiceBox title="Analytics" />
            <ServiceBox title="Corporate" />
            <ServiceBox title="Credit Information" />
            <ServiceBox title="Other" />
          </div>
          <Button variant="outline" asChild>
            <a 
              href="https://www.example.com/ion-group" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Learn More <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Company;