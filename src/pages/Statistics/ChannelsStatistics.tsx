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
      text: 'Channels Statistics'
    },
    labels: false
  }
};

const channel_colors = {
  deleted: 'rgba(255, 99, 132, 0.5)',
  created: 'rgba(53, 162, 235, 0.5)'
};

export default function ChannelsStatistics({
  activeIndex
}: {
  activeIndex: number;
}) {
  const { user } = useContext(UserContext);
  const [showChart, setShowChart] = useState(false);
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
    if (channels.length < 3) {
      setShowChart(false);
      setDataSet({
        labels: [],
        created: [],
        deleted: []
      });
      return;
    }

    const deleted: number[] = channels.map((c) => c.deleted);
    const created: number[] = channels.map((c) => c.created);
    const _date: string[] = channels.map((c) => c.date);

    setDataSet({
      labels: _date || [],
      created: created || [],
      deleted: deleted || []
    });
    setShowChart(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelStats, activeIndex]);

  return (
    <Box
      display={'grid'}
      justifyContent={'center'}
      placeItems={'center'}
      mb={5}
      w={{ base: '90%', md: '65%' }}
      margin={'0 auto'}
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

      <Flex minHeight={300} alignItems={'center'} justifyContent={'center'}>
        <Line
          options={options}
          data={data}
          updateMode="resize"
          style={{ minHeight: '275px' }}
        />
        {!showChart && (
          <Text position={'absolute'}>Chart data not yet available !</Text>
        )}
      </Flex>
      <Text mt={5} fontWeight={600} textAlign={'center'}>
        Channels Statistics
      </Text>
    </Box>
  );
}
