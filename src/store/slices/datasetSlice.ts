import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnDef } from '@tanstack/react-table';

interface DatasetState {
  selectedDataset: string | null;
  selectedColumns: string[];
  data: any[];
  columns: ColumnDef<any>[];
  isLoading: boolean;
  error: string | null;
  // Add cache-related state
  cachedQueries: {
    [key: string]: {
      data: any[];
      columns: ColumnDef<any>[];
      timestamp: number;
    };
  };
  lastQuery: string | null;
}

const initialState: DatasetState = {
  selectedDataset: null,
  selectedColumns: [],
  data: [],
  columns: [],
  isLoading: false,
  error: null,
  cachedQueries: {},
  lastQuery: null,
};

const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    setSelectedDataset: (state, action: PayloadAction<string | null>) => {
      state.selectedDataset = action.payload;
    },
    setSelectedColumns: (state, action: PayloadAction<string[]>) => {
      state.selectedColumns = action.payload;
    },
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
    setColumns: (state, action: PayloadAction<ColumnDef<any>[]>) => {
      state.columns = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Add cache-related actions
    cacheQuery: (state, action: PayloadAction<{
      query: string;
      data: any[];
      columns: ColumnDef<any>[];
    }>) => {
      const { query, data, columns } = action.payload;
      state.cachedQueries[query] = {
        data,
        columns,
        timestamp: Date.now(),
      };
      state.lastQuery = query;
    },
    clearCache: (state) => {
      state.cachedQueries = {};
      state.lastQuery = null;
    },
  },
});

export const {
  setSelectedDataset,
  setSelectedColumns,
  setData,
  setColumns,
  setLoading,
  setError,
  cacheQuery,
  clearCache,
} = datasetSlice.actions;

export default datasetSlice.reducer;