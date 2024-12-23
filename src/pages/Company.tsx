import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const companies = [
  {
    name: "Energy",
    description: "Explore our comprehensive energy market data and analytics platform, designed to help businesses make informed decisions in the evolving energy landscape.",
    link: "https://www.cerved.com/en/offering/energy/"
  },
  {
    name: "MBS Consulting",
    description: "Discover how our consulting services can help transform your business through strategic insights and innovative solutions.",
    link: "https://www.cerved.com/en/about-us/companies/mbs/"
  },
  {
    name: "Cerved Group",
    description: "Learn more about Cerved Group's comprehensive business information services and credit management solutions.",
    link: "https://company.cerved.com/"
  },
  {
    name: "ION Group",
    description: "Explore ION Group's trading and workflow solutions that power financial institutions worldwide.",
    link: "https://iongroup.com/"
  }
];

const Company = () => {
  return (
    <div className="space-y-6">
      <h1>Company</h1>
      
      <div className="grid gap-6">
        {companies.map((company) => (
          <Card key={company.name} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold">{company.name}</h2>
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href={company.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:no-underline"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </Button>
              </div>
              <p className="text-muted-foreground">{company.description}</p>
              <Button asChild variant="outline">
                <a 
                  href={company.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:no-underline"
                >
                  Learn More
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Company;