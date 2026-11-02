declare module 'highcharts' {
  const Highcharts: any;
  export default Highcharts;
}

declare module 'highcharts-react-official' {
  import * as React from 'react';
  const HighchartsReact: React.ComponentType<any>;
  export default HighchartsReact;
}
