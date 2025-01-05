import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnDef } from '@tanstack/react-table';

interface DatasetState {
  selectedDataset: string | null;
  selectedColumns: string[];
  data: any[];
  columns: ColumnDef<any>[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DatasetState = {
  selectedDataset: null,
  selectedColumns: [],
  data: [],
  columns: [],
  isLoading: false,
  error: null,
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
  },
});

export const {
  setSelectedDataset,
  setSelectedColumns,
  setData,
  setColumns,
  setLoading,
  setError,
} = datasetSlice.actions;

export default datasetSlice.reducer;