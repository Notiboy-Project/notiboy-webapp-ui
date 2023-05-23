import useSWR from 'swr';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Icon,
  Text
} from '@chakra-ui/react';
import { LineCharUsers } from './LineChart';
import { PieChartStatistics } from './PieChart';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import { useContext, useState } from 'react';
import SelectChannel from '../../components/SelectChannel';
import {
  fetchGlobalStats,
  fetchOptInOutStats,
  fetchUsersStat,
  fethcChannelsStats
} from '../../services/statistics.service';
import { UserContext } from '../../Context/userContext';

export enum ChartType {
  LINE_CHART,
  PIE_CHART
}

export default function StatisticsPage() {
  const [currentChart, setCurrentChart] = useState(ChartType.LINE_CHART);
  const [currentChannel, setCurrentChannel] = useState('');
  const { user } = useContext(UserContext);

  const { data: globalStats } = useSWR(
    `${user?.chain}/global/stat`,
    fetchGlobalStats
  );
  const { data: userStats } = useSWR(
    `${user?.chain}/users/stat`,
    fetchUsersStat
  );
  const { data: channelStats } = useSWR(
    `${user?.chain}/channels/stat`,
    fethcChannelsStats
  );
  const { data: optInOutStats } = useSWR(
    `${user?.chain}/${currentChannel}/opt-in-out/stat`,
    fetchOptInOutStats
  );

  console.log('globalData ==>', globalStats);
  console.log('usersData ==>', userStats);
  console.log('channelStats ==>', channelStats);
  console.log('currentChannel ==>', currentChannel);
  console.log('optInOutStats ==>', optInOutStats);

  return (
    <Box p={5}>
      <Flex justifyContent={'end'} width={'fit-content'}>
        <SelectChannel onChannelSelect={setCurrentChannel} />
      </Flex>
      <Box mt={5}>
        <Box
          width={{ base: '95%', md: '90%', xl: '80%' }}
          margin={'0 auto'}
          maxHeight={'550px'}
        >
          {currentChannel ? (
            <>
              {currentChart === ChartType.LINE_CHART && <LineCharUsers />}
              {currentChart === ChartType.PIE_CHART && <PieChartStatistics />}
            </>
          ) : (
            <Flex
              justifyContent={'center'}
              boxSizing="border-box"
              alignItems={'center'}
              mt={20}
            >
              <Alert
                status="info"
                borderRadius={'2xl'}
                width={{ base: '100%', md: '80%', xl: '65%' }}
              >
                <AlertIcon />
                <AlertTitle>
                  <Text>Please select a channel </Text>
                </AlertTitle>
              </Alert>
            </Flex>
          )}
        </Box>
        <Flex mt={5} justifyContent={'center'}>
          {currentChannel && (
            <>
              <Button
                rounded={'full'}
                display={
                  currentChart === ChartType.LINE_CHART ? 'none' : 'flex'
                }
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
          )}
        </Flex>
      </Box>
    </Box>
  );
}
