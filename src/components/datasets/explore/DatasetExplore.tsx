import { DatasetExploreContainer } from "./DatasetExploreContainer";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetExploreProps {
  selectedDataset: TableNames | null;
  onColumnsChange: (columns: string[]) => void;
  onLoad?: (tableName: string) => void;
}

export const DatasetExplore = ({ 
  selectedDataset, 
  onColumnsChange,
  onLoad 
}: DatasetExploreProps) => {
  return (
    <DatasetExploreContainer
      selectedDataset={selectedDataset}
      onColumnsChange={onColumnsChange}
      onLoad={onLoad}
    />
  );
};