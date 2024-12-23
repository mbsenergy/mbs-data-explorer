import { LatestDocuments } from "@/components/dashboard/LatestDocuments";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";
import { MarketOverview } from "@/components/dashboard/MarketOverview";

const Dashboard = () => {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Dashboard</h1>
      <LatestDocuments />
      <br></br>
      <MarketOverview />
      <br></br>
      <KnowMoreSection />
    </div>
  );
};

export default Dashboard;