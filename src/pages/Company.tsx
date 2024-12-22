import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company</h1>
      
      <div className="grid gap-6">
        <Card className="p-6 bg-card">
          <h2 className="text-2xl font-semibold mb-4">Energy Services</h2>
          <p className="text-muted-foreground mb-4">
            Our Energy Services division provides comprehensive solutions for energy management,
            efficiency, and sustainability. We help organizations optimize their energy usage
            and reduce their environmental impact through innovative technologies and expert consulting.
          </p>
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
          <p className="text-muted-foreground mb-4">
            MBS Consulting delivers strategic business solutions across various sectors.
            Our team of experts provides insights and guidance to help organizations
            navigate complex challenges and achieve their business objectives.
          </p>
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
          <p className="text-muted-foreground mb-4">
            As part of the Cerved Group, we leverage comprehensive data and analytics
            capabilities to provide business information services, credit management
            solutions, and marketing strategies to our clients.
          </p>
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
          <p className="text-muted-foreground mb-4">
            ION Group is a global provider of trading, analytics, and risk management
            solutions for capital markets, commodities, and treasury management.
            We deliver innovative technology that empowers our clients to make
            more informed decisions.
          </p>
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