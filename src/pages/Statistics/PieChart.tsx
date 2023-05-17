import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'green',
        'purple',
        'orange'
      ],
      borderColor: ['white', 'white', 'white', 'white', 'white', 'white'],
      borderWidth: 1
    }
  ]
};

export function PieChartStatistics() {
  return (
    <Pie data={data} height={'550px'} />
  );
}
