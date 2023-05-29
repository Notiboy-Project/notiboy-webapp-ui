import useSWR from 'swr';
import { useContext, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Flex, Text } from '@chakra-ui/react';
import { UserContext } from '../../Context/userContext';
import {
  fetchOptInOutStats,
  optinOutStatsDto
} from '../../services/statistics.service';
import SelectChannel from '../../components/SelectChannel';

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
      position: 'top' as const
    },
    title: {
      display: false,
      text: 'Opted in out Chart'
    },
    label: {
      display: false
    }
  }
};

const optin_out_colors = {
  optin: 'rgba(255, 99, 132, 0.5)',
  optout: 'rgba(53, 162, 235, 0.5)'
};

export default function OptInOutStatistics() {
  const { user } = useContext(UserContext);
  const [currentChannel, setCurrentChannel] = useState('');
  const [dataset, setDataSet] = useState<{
    labels: string[];
    optin: number[];
    optout: number[];
  }>({
    labels: [],
    optin: [],
    optout: []
  });

  const { data: optInOutStats } = useSWR(
    `${user?.chain}/${currentChannel}/opt-in-out/stat`,
    fetchOptInOutStats,
    { revalidateOnFocus: false }
  );
  console.log({ optInOutStats });

  const formatAndSetData = (optinOut: optinOutStatsDto[]) => {
    if (optinOut.length > 0) {
      const optout: number[] = optinOut.map((c) => c.optout);
      const optin: number[] = optinOut.map((c) => c.optin);
      const _date: string[] = optinOut.map((c) => c.date);

      setDataSet({
        labels: _date || [],
        optin: optin || [],
        optout: optout || []
      });
    } else {
      setDataSet({
        labels: [],
        optin: [],
        optout: []
      });
    }
  };

  const data = {
    labels: dataset.labels,
    datasets: [
      {
        // label: 'Number of Users',
        data: dataset.optout,
        borderColor: optin_out_colors.optout,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        // label: 'Number of announcements',
        data: dataset.optin,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: optin_out_colors.optin
      }
    ]
  };

  useEffect(() => {
    formatAndSetData(optInOutStats?.data || []);
  }, [optInOutStats]);

  return (
    <Box>
      <Flex justifyContent={'end'} width={'fit-content'}>
        <SelectChannel onChannelSelect={setCurrentChannel} />
      </Flex>
      <Flex mt={5} justifyContent={'center'} alignItems={'center'} mb={5}>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={optin_out_colors.optout}
          mr={2}
        />
        <Text mr={4}>Opted-in</Text>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={optin_out_colors.optin}
          mr={2}
        />
        <Text>Opted-out</Text>
      </Flex>
      <Line
        options={options}
        data={data}
        updateMode="resize"
        style={{ minHeight: '275px' }}
      />
      <Text mt={5} fontWeight={600} textAlign={'center'}>
        Opted-in-out Statistics
      </Text>
    </Box>
  );
}
