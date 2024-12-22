import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const User = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <Card className="p-6 glass-panel">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="https://github.com/shadcn.png"
            alt="Profile"
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-muted-foreground">john.doe@example.com</p>
          </div>
        </div>
        <Button>Connect to Supabase</Button>
      </Card>
    </div>
  );
};

export default User;