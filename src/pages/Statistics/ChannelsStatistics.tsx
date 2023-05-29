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
  ChannelStatsDto,
  fethcChannelsStats
} from '../../services/statistics.service';

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
      display: false
    },
    title: {
      display: false,
      text: 'Channles Statistics'
    },
    labels: false
  }
};

const channel_colors = {
  deleted: 'rgba(255, 99, 132, 0.5)',
  created: 'rgba(53, 162, 235, 0.5)'
};

export default function ChannelsStatistics() {
  const { user } = useContext(UserContext);
  const [dataset, setDataSet] = useState<{
    labels: string[];
    deleted: number[];
    created: number[];
  }>({
    labels: [],
    deleted: [],
    created: []
  });

  const { data: channelStats } = useSWR(
    `${user?.chain}/channels/stat`,
    fethcChannelsStats,
    { revalidateOnFocus: false }
  );

  const formatAndSetData = (channels: ChannelStatsDto[]) => {
    if (channels.length > 0) {
      const deleted: number[] = channels.map((c) => c.deleted);
      const created: number[] = channels.map((c) => c.created);
      const _date: string[] = channels.map((c) => c.date);

      setDataSet({
        labels: _date || [],
        created: created || [],
        deleted: deleted || []
      });
    } else {
      setDataSet({
        labels: [],
        created: [],
        deleted: []
      });
    }
  };

  const data = {
    labels: dataset.labels,
    datasets: [
      {
        data: dataset.deleted,
        borderColor: channel_colors.deleted,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        data: dataset.created,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: channel_colors.created
      }
    ]
  };

  useEffect(() => {
    formatAndSetData(channelStats?.data || []);
  }, [channelStats]);

  return (
    <Box
      display={'grid'}
      justifyContent={'center'}
      placeItems={'center'}
      mb={5}
    >
      <Flex justifyContent={'center'} alignItems={'center'} mb={5}>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={channel_colors.deleted}
          mr={2}
        />
        <Text mr={4}>Deleted</Text>
        <Box
          borderRadius={'full'}
          height={'10px'}
          width={'10px'}
          backgroundColor={channel_colors.created}
          mr={2}
        />
        <Text>Created</Text>
      </Flex>
      <Line
        options={options}
        data={data}
        updateMode="resize"
        style={{ minHeight: '275px' }}
      />
      <Text mt={5} fontWeight={600} textAlign={'center'}>
        Channles Statistics
      </Text>
    </Box>
  );
}
