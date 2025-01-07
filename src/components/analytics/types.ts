import { DateRange } from "react-day-picker";

export interface LineConfig {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

export interface AnalyticsData {
  created_at: string;
  dataset_name: string;
  downloaded_at: string;
  id: string;
  is_custom_query: boolean;
  user_id: string;
}

export interface DeveloperData {
  created_at: string;
  downloaded_at: string;
  file_name: string;
  file_section: string;
  id: string;
  user_id: string;
}

export interface ExportsData {
  created_at: string;
  downloaded_at: string;
  export_name: string;
  export_type: string;
  id: string;
  user_id: string;
}

export interface StorageData {
  created_at: string;
  id: string;
  original_name: string;
  storage_id: string;
  tags: string[] | null;
  user_id: string;
}

export interface QueryData {
  created_at: string;
  dataset_name: string;
  downloaded_at: string;
  id: string;
  is_custom_query: boolean;
  user_id: string;
}

export interface ChatData {
  created_at: string;
  id: string;
  message_content: string;
  user_id: string;
}

export interface DownloadsChartProps {
  analyticsData: AnalyticsData[];
  developerData: DeveloperData[];
  exportsData: ExportsData[];
  storageData: StorageData[];
  queryData: QueryData[];
  chatData: ChatData[];
  isLoading: boolean;
}