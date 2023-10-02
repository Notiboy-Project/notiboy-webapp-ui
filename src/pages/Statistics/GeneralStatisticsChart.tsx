import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { GlobalStatDto } from '../../services/statistics.service';
import { Box, Flex, Text } from '@chakra-ui/react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GeneralStatisticsChart({
  data
}: {
  data: GlobalStatDto[];
}) {
  const getFormattedData = () => {
    if (data?.length > 0) {
      return Object.values(data[0]);
    }

    return [0, 0, 0];
  };

  const totalCounts = getFormattedData();

  const pieData: ChartData<'pie'> = {
    // labels: ['Users', 'Notifications', 'Channels'],
    datasets: [
      {
        label: 'Total #',
        data: totalCounts || [0, 0, 0],
        backgroundColor: ['green', 'purple', 'orange'],
        borderColor: ['white', 'white', 'white'],
        borderWidth: 2
      }
    ]
  };

  return (
    <Box w={'100%'} margin={'0 auto'}>
      <Flex justifyContent={'center'} alignItems={'center'} mb={5}>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={'green'}
          mr={2}
        />
        <Text mr={4}>Users ({totalCounts?.[0] || 0})</Text>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={'purple'}
          mr={2}
        />
        <Text mr={4}>Notifications ({totalCounts?.[1] || 0})</Text>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={'yellow.500'}
          mr={2}
        />
        <Text>Channels ({totalCounts?.[2] || 0})</Text>
      </Flex>
      <Pie data={pieData} style={{ margin: '0 auto', maxHeight: '450px' }} />
      <Text fontWeight={600} textAlign={'center'} mt={4}>
        Notiboy Traffic
      </Text>
    </Box>
  );
}
