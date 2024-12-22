import { Card } from "@/components/ui/card";

const Guide = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Guide</h1>
      <Card className="p-6 glass-panel">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Welcome to the application! This guide will help you navigate through
            the various features and functionalities.
          </p>
          <p>
            To get started, please connect your Supabase account to enable all
            features.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Guide;