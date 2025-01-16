import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColumnDef } from "@tanstack/react-table";
import type { Database } from "@/integrations/supabase/types";
import type { Filter } from "@/components/datasets/explore/types";

type TableNames = keyof Database['public']['Tables'];

interface QueryResult {
  data: any[];
  columns: ColumnDef<any>[];
  totalRowCount: number;
  timestamp: number;
  queryText?: string;
  filters?: Filter[];
}

interface SavedQuery {
  queryText: string;
  results: any[] | null;
  columns: ColumnDef<any>[];
  timestamp: number;
}

interface ExploreState {
  selectedDataset: TableNames;
  selectedColumns: string[];
  filters: Filter[];
  data: any[];
  timestamp: number;
}

interface DatasetState {
  queries: Record<string, QueryResult>;
  currentQuery: SavedQuery | null;
  exploreState: ExploreState | null;
  addQueryResult: (
    tableName: TableNames, 
    data: any[], 
    columns: ColumnDef<any>[], 
    totalRowCount: number,
    queryText?: string,
    filters?: Filter[]
  ) => void;
  getQueryResult: (tableName: TableNames) => QueryResult | null;
  setCurrentQuery: (query: SavedQuery) => void;
  getCurrentQuery: () => SavedQuery | null;
  setExploreState: (state: ExploreState) => void;
  getExploreState: () => ExploreState | null;
  clearCache: () => void;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      queries: {},
      currentQuery: null,
      exploreState: null,
      
      addQueryResult: (tableName, data, columns, totalRowCount, queryText, filters) => {
        set((state) => ({
          queries: {
            ...state.queries,
            [tableName]: {
              data,
              columns,
              totalRowCount,
              queryText,
              filters,
              timestamp: Date.now(),
            },
          },
        }));
      },

      getQueryResult: (tableName) => {
        const query = get().queries[tableName];
        if (!query) return null;

        // Check if cache is still valid (less than 1 hour old)
        if (Date.now() - query.timestamp > CACHE_DURATION) {
          return null;
        }

        return query;
      },

      setCurrentQuery: (query) => {
        set({ currentQuery: query });
      },

      getCurrentQuery: () => {
        const query = get().currentQuery;
        if (!query) return null;

        // Check if cache is still valid
        if (Date.now() - query.timestamp > CACHE_DURATION) {
          set({ currentQuery: null });
          return null;
        }

        return query;
      },

      setExploreState: (state) => {
        set({ exploreState: { ...state, timestamp: Date.now() } });
      },

      getExploreState: () => {
        const state = get().exploreState;
        if (!state) return null;

        // Check if cache is still valid
        if (Date.now() - state.timestamp > CACHE_DURATION) {
          set({ exploreState: null });
          return null;
        }

        return state;
      },

      clearCache: () => {
        set({ queries: {}, currentQuery: null, exploreState: null });
      },
    }),
    {
      name: 'dataset-storage',
    }
  )
);