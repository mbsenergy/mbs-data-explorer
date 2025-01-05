import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SeriesOptionsType, AxisTypeValue } from 'highcharts';

// Define a serializable subset of chart options
interface SerializableChartOptions {
  title?: {
    text: string;
  };
  xAxis?: {
    type?: AxisTypeValue;
    title?: {
      text: string;
    };
  };
  yAxis?: {
    type?: AxisTypeValue;
    title?: {
      text: string;
    };
  };
  series?: SerializableSeriesOptions[];
  plotOptions?: {
    series?: {
      animation?: boolean;
      marker?: {
        radius?: number;
      };
    };
  };
}

// Define serializable series options
interface SerializableSeriesOptions {
  type?: string;
  name?: string;
  data?: (number | [number | string, number] | null)[];
  color?: string;
}

interface VisualizationState {
  plotConfig: {
    xAxis: string;
    yAxis: string;
    chartType: string;
    groupBy: string;
    aggregation: string;
  };
  chartOptions: SerializableChartOptions;
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
    setChartOptions: (state, action: PayloadAction<SerializableChartOptions>) => {
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