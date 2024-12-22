import { Card } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Card className="p-6 glass-panel">
        <h2 className="text-xl font-semibold mb-4">Data Analysis</h2>
        <p className="text-muted-foreground">
          Connect to Supabase to enable analytics features...
        </p>
      </Card>
    </div>
  );
};

export default Analytics;