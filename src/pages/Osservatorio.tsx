import { LatestDocuments } from "@/components/osservatorio/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Osservatorio = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Osservatorio</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Osservatorio;