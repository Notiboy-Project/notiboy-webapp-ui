import useSWR from 'swr';
import {
  fetchGlobalStats,
  fetchOptInOutStats,
  fetchUsersStat,
  fethcChannelsStats
} from '../../services/statistics.service';
import { useContext } from 'react';
import { UserContext } from '../../Context/userContext';
import { ChartType } from '.';
import { LineCharUsers } from './LineChart';
import { PieChartStatistics } from './PieChart';

interface StatisticsPlaceholderProps {
  channel: string
  currentChart: ChartType
}

const swrConfig = {
  revalidateOnFocus: false
};

export default function StatisticsPlaceholder(props: StatisticsPlaceholderProps) {
  const { user } = useContext(UserContext);
  const { channel, currentChart } = props

  const { data: globalStats } = useSWR(
    `${user?.chain}/global/stat`,
    fetchGlobalStats
  );
  const { data: userStats } = useSWR(
    `${user?.chain}/users/stat`,
    fetchUsersStat,
    swrConfig
  );
  const { data: channelStats } = useSWR(
    `${user?.chain}/channels/stat`,
    fethcChannelsStats,
    swrConfig
  );
  const { data: optInOutStats } = useSWR(
    `${user?.chain}/${channel}/opt-in-out/stat`,
    fetchOptInOutStats,
    swrConfig
  );

  console.log({ globalStats })
  console.log({ userStats })
  console.log({ channelStats })
  console.log({ optInOutStats })

  return (
    <>
        {currentChart === ChartType.LINE_CHART && <LineCharUsers />}
        {currentChart === ChartType.PIE_CHART && <PieChartStatistics />}
    </>
  );
}
