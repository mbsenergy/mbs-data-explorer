import { LatestDocuments } from "@/components/scenario/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Scenario = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Scenario Analysis</h1>
      <LatestDocuments />
      <br></br>
      <MarketOverview />
      <br></br>
      <KnowMoreSection />
    </div>
  );
};

export default Scenario;