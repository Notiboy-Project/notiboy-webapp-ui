import useSWR from 'swr';
import {
  fetchOptInOutStats,
  fetchUsersStat,
  fethcChannelsStats
} from '../../services/statistics.service';
import { useContext } from 'react';
import { UserContext } from '../../Context/userContext';
import { ChartType } from '.';

interface StatisticsPlaceholderProps {
  channel: string;
  currentChart: ChartType;
}

const swrConfig = {
  revalidateOnFocus: false
};

export default function StatisticsPlaceholder(
  props: StatisticsPlaceholderProps
) {
  const { user } = useContext(UserContext);
  const { channel } = props;

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

  console.log({ userStats });
  console.log({ channelStats });
  console.log({ optInOutStats });

  return <>p</>;
}
