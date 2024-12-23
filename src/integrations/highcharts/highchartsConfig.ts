// src/utils/highchartsConfig.ts

import Highcharts from 'highcharts';

// Tailwind theme colors (import or manually add based on your tailwind config)
const themeColors = {
  navy: "#002B4D",      // Corporate Navy
  teal: "#00A99D",      // Corporate Teal
  blue: "#4DC3D7",      // Corporate Blue
  green: "#9ED19D",     // Corporate Green
  yellow: "#F2C94C",    // Corporate Yellow
  orange: "#F2994A",    // Corporate Orange
  primary: "hsl(var(--primary))", // Primary color
  secondary: "hsl(var(--secondary))", // Secondary color
  background: "hsl(var(--background))", // Background color
  foreground: "hsl(var(--foreground))"  // Foreground color
};

export const highchartsConfig = {
  chart: {
    backgroundColor: themeColors.background,
    style: {
      fontFamily: 'Arial, sans-serif',
    },
  },
  title: {
    style: {
      color: themeColors.foreground,
      fontSize: '24px',
    },
  },
  tooltip: {
    backgroundColor: themeColors.navy,
    borderColor: themeColors.teal,
    style: {
      color: themeColors.foreground,
    },
  },
  xAxis: {
    lineColor: themeColors.foreground,
    gridLineColor: themeColors.foreground,
    labels: {
      style: {
        color: themeColors.foreground,
      },
    },
  },
  yAxis: {
    lineColor: themeColors.foreground,
    gridLineColor: themeColors.foreground,
    labels: {
      style: {
        color: themeColors.foreground,
      },
    },
  },
  legend: {
    itemStyle: {
      color: themeColors.foreground,
    },
  },
  colors: [
    themeColors.navy,
    themeColors.teal,
    themeColors.blue,
    themeColors.green,
    themeColors.yellow,
    themeColors.orange
  ],
  series: [
    {
      name: 'Series 1',
      data: [1, 2, 3, 4, 5],
    },
    {
      name: 'Series 2',
      data: [5, 4, 3, 2, 1],
    },
  ],
};

export default highchartsConfig;
