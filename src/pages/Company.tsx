import { Card } from "@/components/ui/card";

const Company = () => {
  const sections = [
    {
      title: "Energy Services",
      items: [
        "Strategy & Asset Valuation",
        "Osservatorio energia",
        "Scenario",
        "Data & Modelling",
        "Due Dilligence",
        "PPA"
      ]
    },
    {
      title: "MBS Consulting",
      items: [
        "Insurance",
        "Banking",
        "Energy",
        "Risk Advisory",
        "Financial Services",
        "Innovation Team",
        "Public Administration",
        "EGS",
        "More"
      ]
    },
    {
      title: "Cerved Group",
      items: [
        "Cerved",
        "Rating Agency",
        "Data & AI",
        "Spazio Dati",
        "ProWeb"
      ]
    },
    {
      title: "ION Group",
      items: [
        "Market Analytics",
        "Core Banking",
        "Analytics",
        "Corporate",
        "Credit Information",
        "Other"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company</h1>
      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="glass-panel p-4 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Company;