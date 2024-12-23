const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-heading">Analytics</h1>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg glass-panel">
            <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
            <p className="text-muted-foreground">
              Comprehensive market analysis tools and insights
            </p>
          </div>
          <div className="p-6 rounded-lg glass-panel">
            <h2 className="text-xl font-semibold mb-4">Price Trends</h2>
            <p className="text-muted-foreground">
              Historical and current price trend analysis
            </p>
          </div>
          <div className="p-6 rounded-lg glass-panel">
            <h2 className="text-xl font-semibold mb-4">Demand Forecasting</h2>
            <p className="text-muted-foreground">
              Advanced demand prediction and forecasting tools
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg glass-panel">
          <h2 className="text-xl font-semibold mb-4">Custom Reports</h2>
          <p className="text-muted-foreground">
            Generate customized reports based on your specific requirements
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;