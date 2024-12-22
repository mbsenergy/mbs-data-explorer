import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-2">GDP Overview</h3>
          <p className="text-muted-foreground">
            Interactive visualization coming soon...
          </p>
        </Card>
        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-2">Energy Prices</h3>
          <p className="text-muted-foreground">
            Interactive visualization coming soon...
          </p>
        </Card>
        <Card className="p-6 glass-panel">
          <h3 className="text-lg font-semibold mb-2">Commodities</h3>
          <p className="text-muted-foreground">
            Interactive visualization coming soon...
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;