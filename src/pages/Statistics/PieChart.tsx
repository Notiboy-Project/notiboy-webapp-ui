import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3],
      backgroundColor: ['green', 'purple', 'orange'],
      borderColor: ['white', 'white', 'white'],
      borderWidth: 2
    }
  ]
};

export function PieChartStatistics() {
  return <Pie data={data} height={'550px'} />;
}
