import { LatestDocuments } from "@/components/dashboard/LatestDocuments";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";
import { MarketOverview } from "@/components/dashboard/MarketOverview";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Dashboard;