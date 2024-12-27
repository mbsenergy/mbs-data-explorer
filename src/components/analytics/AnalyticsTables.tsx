import { DownloadsTable } from "./DownloadsTable";

interface AnalyticsTablesProps {
  analyticsData: any[];
  developerData: any[];
  exportsData: any[];
  storageData: any[];
  queryData: any[];
  chatData: any[];
  isLoading: {
    analytics: boolean;
    developer: boolean;
    exports: boolean;
    storage: boolean;
    queries: boolean;
    chat: boolean;
  };
}

export const AnalyticsTables = ({
  analyticsData,
  developerData,
  exportsData,
  storageData,
  queryData,
  chatData,
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

      <DownloadsTable
        title="Chat Messages"
        data={chatData || []}
        isLoading={isLoading.chat}
      />
    </div>
  );
};