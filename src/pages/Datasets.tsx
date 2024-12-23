import { DatasetList } from "@/components/datasets/DatasetList";

const Datasets = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-heading">Datasets</h1>
      <div className="grid gap-6">
        <DatasetList />
      </div>
    </div>
  );
};

export default Datasets;
