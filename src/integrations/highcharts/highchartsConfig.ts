import Highcharts from 'highcharts';

Highcharts.theme = {
  colors: [
      '#002B4D',  // Navy
      '#00A99D',  // Teal
      '#4DC3D7',  // Blue
      '#9ED19D',  // Green
      '#F2C94C',  // Yellow
      '#F2994A',  // Orange
  ],
  chart: {
      backgroundColor: 'transparent', // Transparent background
      style: {
          fontFamily: 'Inter, sans-serif',
      },
  },
  title: {
      style: {
          color: '#FFFFFF', // Foreground color
          fontSize: '16px',
          fontWeight: 'bold',
      }
  },
  subtitle: {
      style: {
          color: '#FFFFFF', // Foreground color for subtitle
          fontSize: '12px',
          fontWeight: 'bold',
      }
  },
  tooltip: {
      backgroundColor: '#002B4D', // Navy background
      borderColor: '#00A99D', // Teal border
      style: {
          color: '#FFFFFF', // Foreground color for tooltip
      },
  },
  xAxis: {
      gridLineColor: '#1A1A2E', // Liner color (background color in HEX)
      gridLineWidth: 0.5,
      lineWidth: 0.5,
      title: {
          style: {
              color: '#00A99D', // Teal for x-axis title
              fontSize: '9px',
              fontWeight: 'bold',
          },
      },
      labels: {
          style: {
              color: '#4DC3D7', // Blue for x-axis labels
              fontSize: '8px',
              fontWeight: 'bold',
          },
      },
  },
  yAxis: {
      gridLineColor: '#1A1A2E', // Liner color for y-axis
      gridLineWidth: 0.5,
      lineWidth: 0.5,
      title: {
          style: {
              color: '#00A99D', // Teal for y-axis title
              fontSize: '9px',
              fontWeight: 'bold',
          },
      },
      labels: {
          style: {
              color: '#4DC3D7', // Blue for y-axis labels
              fontSize: '8px',
              fontWeight: 'bold',
          },
      },
  },
  legend: {
      itemStyle: {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#FFFFFF', // Foreground color for legend
      },
      itemHoverStyle: {
          color: 'gray',
      },
  },
  colors: [
      '#002B4D', // Navy
      '#00A99D', // Teal
      '#4DC3D7', // Blue
      '#9ED19D', // Green
      '#F2C94C', // Yellow
      '#F2994A', // Orange
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

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
