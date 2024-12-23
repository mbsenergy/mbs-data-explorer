import { LatestDocuments } from "@/components/osservatorio/LatestDocuments";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { KnowMoreSection } from "@/components/dashboard/KnowMoreSection";

const Osservatorio = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Osservatorio</h1>
      <LatestDocuments />
      <MarketOverview />
      <KnowMoreSection />
    </div>
  );
};

export default Osservatorio;