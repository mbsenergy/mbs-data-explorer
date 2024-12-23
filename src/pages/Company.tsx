import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  LineChart, 
  Sun, 
  FileText, 
  Database, 
  ShieldCheck, 
  Briefcase,
  Building,
  Users,
  Shield,
  Banknote,
  Globe,
  ChartBar,
  Monitor,
  ChartLine,
  Building2,
} from "lucide-react";

const companies = [
  {
    name: "Energy",
    description: "Explore our comprehensive energy market data and analytics platform, designed to help businesses make informed decisions in the evolving energy landscape.",
    link: "https://mbsconsulting.ref-e.com/",
    services: [
      { name: "Strategy & Asset Valuation", icon: LineChart },
      { name: "Osservatorio energia", icon: Sun },
      { name: "Scenario", icon: FileText },
      { name: "Data & Modelling", icon: Database },
      { name: "Due Dilligence", icon: ShieldCheck },
      { name: "PPA", icon: Briefcase }
    ]
  },
  {
    name: "MBS Consulting",
    description: "Discover how our consulting services can help transform your business through strategic insights and innovative solutions.",
    link: "https://www.mbsconsulting.com/",
    services: [
      { name: "Insurance", icon: Shield },
      { name: "Banking", icon: Building2 },
      { name: "Energy", icon: Sun },
      { name: "Risk Advisory", icon: ShieldCheck },
      { name: "Financial Services", icon: Banknote },
      { name: "Innovation Team", icon: Users },
      { name: "Public Administration", icon: Building },
      { name: "EGS", icon: Users },
    ]
  },
  {
    name: "Cerved Group",
    description: "Learn more about Cerved Group's comprehensive business information services and credit management solutions.",
    link: "https://www.cerved.com/",
    services: [
      { name: "Cerved", icon: Globe },
      { name: "Rating Agency", icon: ChartBar },
      { name: "Data & AI", icon: Database },
      { name: "Spazio Dati", icon: Database },
      { name: "ProWeb", icon: Monitor }
    ]
  },
  {
    name: "ION Group",
    description: "Explore ION Group's trading and workflow solutions that power financial institutions worldwide.",
    link: "https://iongroup.com/markets/",
    services: [
      { name: "Market Analytics", icon: ChartLine },
      { name: "Core Banking", icon: Building2 },
      { name: "Analytics", icon: ChartBar },
      { name: "Corporate", icon: Users },
      { name: "Credit Information", icon: Database },
      { name: "Other", icon: Users }
    ]
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
              
              {company.services && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                  {company.services.map((service) => (
                    <div 
                      key={service.name}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <service.icon className="h-5 w-5 text-corporate-teal" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                  ))}
                </div>
              )}

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