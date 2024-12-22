import { Card } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company</h1>
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Company Details</h3>
          <div className="mt-2">
            <p className="text-muted-foreground">
              Connect to Supabase to view company information...
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Company;