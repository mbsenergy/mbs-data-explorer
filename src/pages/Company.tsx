import { CollapsibleCard } from "@/components/ui/collapsible-card";
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
      <h1 className="text-3xl font-bold font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">Company Products</h1>
      
      <div className="grid gap-6">
        <CollapsibleCard title="Energy Services">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ServiceBox title="Strategy & Asset Valuation" />
              <ServiceBox title="Osservatorio energia" />
              <ServiceBox title="Scenario" />
              <ServiceBox title="Data & Modelling" />
              <ServiceBox title="Due Dilligence" />
              <ServiceBox title="PPA" />
            </div>
            <Button variant="default" className="bg-corporate-teal hover:bg-corporate-teal/90" asChild>
              <a 
                href="https://mbsconsulting.ref-e.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="MBS Consulting">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Button variant="default" className="bg-corporate-blue hover:bg-corporate-blue/90" asChild>
              <a 
                href="https://www.mbsconsulting.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Cerved Group">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ServiceBox title="Cerved" />
              <ServiceBox title="Rating Agency" />
              <ServiceBox title="Data & AI" />
              <ServiceBox title="Spazio Dati" />
              <ServiceBox title="ProWeb" />
            </div>
            <Button variant="default" className="bg-corporate-orange hover:bg-corporate-orange/90" asChild>
              <a 
                href="https://www.cerved.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="ION Group">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ServiceBox title="Market Analytics" />
              <ServiceBox title="Core Banking" />
              <ServiceBox title="Analytics" />
              <ServiceBox title="Corporate" />
              <ServiceBox title="Credit Information" />
              <ServiceBox title="Other" />
            </div>
            <Button variant="default" className="bg-corporate-yellow hover:bg-corporate-yellow/90" asChild>
              <a 
                href="https://iongroup.com/markets/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CollapsibleCard>
      </div>
    </div>
  );
};

export default Company;