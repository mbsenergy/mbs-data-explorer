import Highcharts from 'highcharts';

const theme: Partial<Highcharts.Options> = {
  colors: [
    '#4DC3D7',  // corporate.blue
    '#00A99D',  // corporate.teal
    '#9ED19D',  // corporate.green
    '#F2C94C',  // corporate.yellow
    '#F2994A',  // corporate.orange
    '#002B4D',  // corporate.navy
  ],
  chart: {
    backgroundColor: 'hsl(220 100% 2%)', // matches --background
    style: {
      fontFamily: 'Inter, sans-serif',
    },
    plotBorderColor: 'hsl(217 100% 15%)', // matches --border
  },
  title: {
    style: {
      color: 'hsl(210 40% 98%)', // matches --foreground
      fontSize: '16px',
      fontWeight: '600',
    }
  },
  subtitle: {
    style: {
      color: 'hsl(215 20.2% 65.1%)', // matches --muted-foreground
      fontSize: '12px',
    }
  },
  xAxis: {
    gridLineColor: 'hsl(217 100% 15%)', // matches --border
    gridLineWidth: 1,
    lineColor: 'hsl(217 100% 15%)',
    tickColor: 'hsl(217 100% 15%)',
    labels: {
      style: {
        color: 'hsl(215 20.2% 65.1%)', // matches --muted-foreground
        fontSize: '11px',
      }
    },
    title: {
      style: {
        color: 'hsl(210 40% 98%)', // matches --foreground
      }
    }
  },
  yAxis: {
    gridLineColor: 'hsl(217 100% 15%)', // matches --border
    gridLineWidth: 1,
    lineColor: 'hsl(217 100% 15%)',
    tickColor: 'hsl(217 100% 15%)',
    labels: {
      style: {
        color: 'hsl(215 20.2% 65.1%)', // matches --muted-foreground
        fontSize: '11px',
      }
    },
    title: {
      style: {
        color: 'hsl(210 40% 98%)', // matches --foreground
      }
    }
  },
  legend: {
    backgroundColor: 'transparent',
    itemStyle: {
      color: 'hsl(210 40% 98%)', // matches --foreground
      fontWeight: '500',
      fontSize: '12px',
    },
    itemHoverStyle: {
      color: 'hsl(215 20.2% 65.1%)', // matches --muted-foreground
    }
  },
  tooltip: {
    backgroundColor: 'hsl(222 84% 5%)', // matches --card
    borderColor: 'hsl(217 100% 15%)', // matches --border
    style: {
      color: 'hsl(210 40% 98%)', // matches --foreground
    },
    borderRadius: 6,
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: 'hsl(210 40% 98%)', // matches --foreground
        style: {
          fontSize: '11px',
        }
      },
      marker: {
        lineColor: 'hsl(217 100% 15%)', // matches --border
      }
    }
  },
  credits: {
    style: {
      color: 'hsl(215 20.2% 65.1%)', // matches --muted-foreground
    }
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: 'hsl(210 40% 98%)', // matches --foreground
    },
    activeDataLabelStyle: {
      color: 'hsl(210 40% 98%)', // matches --foreground
    }
  },
  navigation: {
    buttonOptions: {
      theme: {
        fill: 'transparent',
        stroke: 'hsl(217 100% 15%)', // matches --border
        style: {
          color: 'hsl(210 40% 98%)'
        },
        states: {
          hover: {
            fill: 'hsl(217 100% 15%)' // matches --border
          },
          select: {
            fill: 'hsl(217 100% 15%)' // matches --border
          }
        }
      }
    }
  }
};

// Apply the theme
Highcharts.setOptions(theme);

export default theme;