import { LatestDocuments } from "@/components/scenario/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Scenario = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Scenario Analysis</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Scenario;