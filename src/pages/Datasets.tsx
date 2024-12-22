import { Card } from "@/components/ui/card";

const Datasets = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datasets</h1>
      <Card className="p-6 glass-panel">
        <h2 className="text-xl font-semibold mb-4">Dataset Explorer</h2>
        <p className="text-muted-foreground">
          Connect to Supabase to enable dataset exploration...
        </p>
      </Card>
    </div>
  );
};

export default Datasets;