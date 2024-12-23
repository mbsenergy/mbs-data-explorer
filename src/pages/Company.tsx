import { Card } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-heading">Company Products</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Product 1</h2>
          <p>Description of Product 1.</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Product 2</h2>
          <p>Description of Product 2.</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Product 3</h2>
          <p>Description of Product 3.</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Product 4</h2>
          <p>Description of Product 4.</p>
        </Card>
      </div>
    </div>
  );
};

export default Company;
