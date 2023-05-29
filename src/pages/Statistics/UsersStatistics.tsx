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
import { ChannelStatsDto, fetchUsersStat } from '../../services/statistics.service';

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
      display: false,
      position: 'top' as const
    },
    title: {
      display: false,
      text: 'Users Statistics'
    }
  }
};

const users_colors = {
  offboard: 'rgba(255, 99, 132, 0.5)',
  onboard: 'rgba(53, 162, 235, 0.5)'
};

export default function UsersStatistics() {

  const [dataset, setDataSet] = useState<{
    labels: string[];
    offboard: number[];
    onboard: number[];
  }>({
    labels: [],
    offboard: [],
    onboard: []
  });
  const { user } = useContext(UserContext);

  const { data: userStats } = useSWR(
    `${user?.chain}/users/stat`,
    fetchUsersStat,
    { revalidateOnFocus: false }
  );

  console.log({ userStats });

  const formatAndSetData = (channels: ChannelStatsDto[]) => {
    if (channels.length > 0) {
      const deleted: number[] = channels.map((c) => c.deleted);
      const created: number[] = channels.map((c) => c.created);
      const _date: string[] = channels.map((c) => c.date);

      setDataSet({
        labels: _date || [],
        offboard: created || [],
        onboard: deleted || []
      });
    } else {
      setDataSet({
        labels: [],
        offboard: [],
        onboard: []
      });
    }
  };

  const data = {
    labels: dataset.labels,
    datasets: [
      {
        // label: 'Number of Users',
        data: dataset.offboard,
        borderColor: users_colors.offboard,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        // label: 'Number of announcements',
        data: dataset.onboard,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: users_colors.onboard
      }
    ]
  };

  useEffect(() => {
    formatAndSetData(userStats?.data || []);
  }, [userStats]);

  return (
    <Box>
      <Flex justifyContent={'center'} alignItems={'center'} mb={5}>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={users_colors.offboard}
          mr={2}
        />
        <Text mr={4}>Offboard</Text>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={users_colors.onboard}
          mr={2}
        />
        <Text>Onboard</Text>
      </Flex>
      <Line
        options={options}
        data={data}
        updateMode="resize"
        style={{ minHeight: '275px' }}
      />
      <Text mt={5} fontWeight={600} textAlign={'center'}>
        Users Statistics
      </Text>
    </Box>
  );
}
