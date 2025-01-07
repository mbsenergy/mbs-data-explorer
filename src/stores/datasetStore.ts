import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColumnDef } from "@tanstack/react-table";
import type { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

interface DatasetState {
  queries: Record<string, {
    data: any[];
    columns: ColumnDef<any>[];
    timestamp: number;
    totalRowCount: number;
  }>;
  addQueryResult: (tableName: TableNames, data: any[], columns: ColumnDef<any>[], totalRowCount: number) => void;
  getQueryResult: (tableName: TableNames) => {
    data: any[];
    columns: ColumnDef<any>[];
    totalRowCount: number;
  } | null;
  clearCache: () => void;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      queries: {},
      
      addQueryResult: (tableName, data, columns, totalRowCount) => {
        set((state) => ({
          queries: {
            ...state.queries,
            [tableName]: {
              data,
              columns,
              totalRowCount,
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

        return {
          data: query.data,
          columns: query.columns,
          totalRowCount: query.totalRowCount,
        };
      },

      clearCache: () => {
        set({ queries: {} });
      },
    }),
    {
      name: 'dataset-storage',
    }
  )
);