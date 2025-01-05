import { configureStore } from '@reduxjs/toolkit';
import datasetReducer from './slices/datasetSlice';
import queryReducer from './slices/querySlice';
import visualizationReducer from './slices/visualizationSlice';

export const store = configureStore({
  reducer: {
    dataset: datasetReducer,
    query: queryReducer,
    visualization: visualizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;