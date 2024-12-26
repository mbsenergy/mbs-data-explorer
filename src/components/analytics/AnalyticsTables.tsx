import { DownloadsTable } from "./DownloadsTable";

interface AnalyticsTablesProps {
  analyticsData: any[];
  developerData: any[];
  exportsData: any[];
  storageData: any[];
  queryData: any[];
  isLoading: {
    analytics: boolean;
    developer: boolean;
    exports: boolean;
    storage: boolean;
    queries: boolean;
  };
}

export const AnalyticsTables = ({
  analyticsData,
  developerData,
  exportsData,
  storageData,
  queryData,
  isLoading
}: AnalyticsTablesProps) => {
  return (
    <div className="space-y-6">
      <DownloadsTable
        title="Dataset Samples"
        data={analyticsData?.filter(item => !item.is_custom_query) || []}
        isLoading={isLoading.analytics}
      />
      
      <DownloadsTable
        title="Query Executions"
        data={queryData || []}
        isLoading={isLoading.queries}
      />

      <DownloadsTable
        title="Developer Files"
        data={developerData || []}
        isLoading={isLoading.developer}
      />

      <DownloadsTable
        title="Dataset Exports"
        data={exportsData || []}
        isLoading={isLoading.exports}
      />

      <DownloadsTable
        title="File Uploads"
        data={storageData || []}
        isLoading={isLoading.storage}
      />
    </div>
  );
};