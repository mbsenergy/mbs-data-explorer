import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Options } from 'highcharts';

interface VisualizationState {
  plotConfig: {
    xAxis: string;
    yAxis: string;
    chartType: string;
    groupBy: string;
    aggregation: string;
  };
  chartOptions: Options;
  activeTab: string;
}

const initialState: VisualizationState = {
  plotConfig: {
    xAxis: '',
    yAxis: '',
    chartType: 'scatter',
    groupBy: '',
    aggregation: 'none',
  },
  chartOptions: {},
  activeTab: 'table',
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setPlotConfig: (state, action: PayloadAction<Partial<VisualizationState['plotConfig']>>) => {
      state.plotConfig = { ...state.plotConfig, ...action.payload };
    },
    setChartOptions: (state, action: PayloadAction<Options>) => {
      state.chartOptions = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  setPlotConfig,
  setChartOptions,
  setActiveTab,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;