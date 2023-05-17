import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const data = {
  labels,
  datasets: [
    {
      label: 'Number of Users',
      data: [
        25, 45, 35, 85, 65, 24, 14, 98, 25, 66
      ],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Number of announcements',
      data: [
        15, 48, 65, 24, 12, 69, 77, 56, 18, 85
      ],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function LineCharUsers() {
  return <Line options={options} data={data} updateMode='resize'/>;
}
