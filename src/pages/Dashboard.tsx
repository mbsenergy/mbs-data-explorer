import { LatestDocuments } from "@/components/dashboard/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1>Dashboard</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Dashboard;