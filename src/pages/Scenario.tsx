import { LatestDocuments } from "@/components/scenario/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Scenario = () => {
  return (
    <div className="space-y-8">
      <h1>Scenario Analysis</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Scenario;