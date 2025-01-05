import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueryState {
  currentQuery: string;
  savedQueries: Array<{
    id: string;
    name: string;
    query: string;
  }>;
  queryResults: any[];
  isExecuting: boolean;
  error: string | null;
}

const initialState: QueryState = {
  currentQuery: '',
  savedQueries: [],
  queryResults: [],
  isExecuting: false,
  error: null,
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setSavedQueries: (state, action: PayloadAction<Array<{ id: string; name: string; query: string }>>) => {
      state.savedQueries = action.payload;
    },
    addSavedQuery: (state, action: PayloadAction<{ id: string; name: string; query: string }>) => {
      state.savedQueries.push(action.payload);
    },
    setQueryResults: (state, action: PayloadAction<any[]>) => {
      state.queryResults = action.payload;
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setQueryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentQuery,
  setSavedQueries,
  addSavedQuery,
  setQueryResults,
  setExecuting,
  setQueryError,
} = querySlice.actions;

export default querySlice.reducer;