import Highcharts from 'highcharts';

const theme: Partial<Highcharts.Options> = {
  colors: [
    '#002B4D',  // Navy
    '#00A99D',  // Teal
    '#4DC3D7',  // Blue
    '#9ED19D',  // Green
    '#F2C94C',  // Yellow
    '#F2994A',  // Orange
  ],
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, sans-serif',
    },
  },
  title: {
    style: {
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: 'bold',
    }
  },
  subtitle: {
    style: {
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 'bold',
    }
  },
  tooltip: {
    backgroundColor: '#002B4D',
    borderColor: '#00A99D',
    style: {
      color: '#FFFFFF',
    },
  },
  xAxis: {
    gridLineColor: '#1A1A2E',
    gridLineWidth: 0.5,
    lineWidth: 0.5,
    title: {
      style: {
        color: '#00A99D',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    labels: {
      style: {
        color: '#4DC3D7',
        fontSize: '8px',
        fontWeight: 'bold',
      },
    },
  },
  yAxis: {
    gridLineColor: '#1A1A2E',
    gridLineWidth: 0.5,
    lineWidth: 0.5,
    title: {
      style: {
        color: '#00A99D',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    labels: {
      style: {
        color: '#4DC3D7',
        fontSize: '8px',
        fontWeight: 'bold',
      },
    },
  },
  legend: {
    itemStyle: {
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    itemHoverStyle: {
      color: 'gray',
    },
  },
  series: [{
    type: 'line',
    name: 'Series 1',
    data: [1, 2, 3, 4, 5]
  }, {
    type: 'line',
    name: 'Series 2',
    data: [5, 4, 3, 2, 1]
  }] as Highcharts.SeriesOptionsType[]
};

// Apply the theme
Highcharts.setOptions(theme);

export default theme;