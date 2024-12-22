import { Card } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company</h1>
      <Card className="p-6 glass-panel">
        <h2 className="text-xl font-semibold mb-4">Company Details</h2>
        <p className="text-muted-foreground">
          Connect to Supabase to view company information...
        </p>
      </Card>
    </div>
  );
};

export default Company;