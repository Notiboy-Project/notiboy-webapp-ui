import { useContext, useState } from 'react';
import useSWR from 'swr';
import { Box, Button, Divider, Flex, Icon } from '@chakra-ui/react';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import GeneralStatisticsChart from './GeneralStatisticsChart';
import { UserContext } from '../../Context/userContext';
import { fetchGlobalStats } from '../../services/statistics.service';
import ChannelsStatistics from './ChannelsStatistics';
import UsersStatistics from './UsersStatistics';
import OptInOutStatistics from './OptInOutStatistics';

export enum ChartType {
  LINE_CHART,
  PIE_CHART
}

export default function StatisticsPage() {
  const [currentChart, setCurrentChart] = useState(ChartType.PIE_CHART);
  const { user } = useContext(UserContext);

  const { data: globalStats } = useSWR(
    `${user?.chain}/global/stat`,
    fetchGlobalStats,
    { revalidateOnFocus: false }
  );

  return (
    <Box p={5}>
      <Box mt={5}>
        <Box
          width={{ base: '95%', md: '90%', xl: '80%' }}
          margin={'0 auto'}
          // maxHeight={'550px'}
        >
          <GeneralStatisticsChart data={globalStats?.data || []} />
          <Divider mt={5} mb={5} />
          <ChannelsStatistics />
          <Divider mt={5} mb={5} />
          <UsersStatistics />
          <Divider mt={5} mb={5} />
          <OptInOutStatistics />
        </Box>
        <Flex mt={5} justifyContent={'center'} display={'none'}>
          <>
            <Button
              rounded={'full'}
              display={currentChart === ChartType.LINE_CHART ? 'none' : 'flex'}
              onClick={() => setCurrentChart(ChartType.LINE_CHART)}
              size={'lg'}
              padding={'15px'}
            >
              <Icon as={AiOutlineLeftCircle} h={30} w={25} fill="blue.400" />
            </Button>
            <Button
              rounded={'full'}
              display={currentChart === ChartType.PIE_CHART ? 'none' : 'flex'}
              onClick={() => setCurrentChart(ChartType.PIE_CHART)}
              size={'lg'}
              padding={'15px'}
            >
              <Icon as={AiOutlineRightCircle} h={30} w={25} fill="blue.400" />
            </Button>
          </>
        </Flex>
      </Box>
    </Box>
  );
}
