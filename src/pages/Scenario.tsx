const Scenario = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-heading">Scenario</h1>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg metallic-card">
            <h2 className="text-xl font-semibold mb-4">Price Scenarios</h2>
            <p className="text-muted-foreground">
              Explore different price scenarios and their potential market impacts
            </p>
          </div>
          <div className="p-6 rounded-lg metallic-card">
            <h2 className="text-xl font-semibold mb-4">Demand Analysis</h2>
            <p className="text-muted-foreground">
              Analyze demand patterns and forecast future trends
            </p>
          </div>
          <div className="p-6 rounded-lg metallic-card">
            <h2 className="text-xl font-semibold mb-4">Production Types</h2>
            <p className="text-muted-foreground">
              Compare different production scenarios and their efficiency
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg metallic-card">
          <h2 className="text-xl font-semibold mb-4">Historical Comparison</h2>
          <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Chart visualization will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scenario;