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
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import { useContext, useState } from 'react';
import SelectChannel from '../../components/SelectChannel';

import StatisticsPlaceholder from './StatisticsPlaceholder';
import { PieChartStatistics } from './PieChart';
import { UserContext } from '../../Context/userContext';
import { fetchGlobalStats } from '../../services/statistics.service';

export enum ChartType {
  LINE_CHART,
  PIE_CHART
}

export default function StatisticsPage() {
  const [currentChart, setCurrentChart] = useState(ChartType.PIE_CHART);
  const [currentChannel, setCurrentChannel] = useState('');
  const { user } = useContext(UserContext);

  const { data: globalStats } = useSWR(
    `${user?.chain}/global/stat`,
    fetchGlobalStats,
    { revalidateOnFocus: false }
  );

  return (
    <Box p={5}>
      <Flex justifyContent={'end'} width={'fit-content'}>
        <SelectChannel onChannelSelect={setCurrentChannel} />
      </Flex>
      <Box mt={5}>
        <Box
          width={{ base: '95%', md: '90%', xl: '80%' }}
          margin={'0 auto'}
          // maxHeight={'550px'}
        >
          {currentChart === ChartType.PIE_CHART && (
            <PieChartStatistics data={globalStats?.data || []} />
          )}
          {currentChannel ? (
            <StatisticsPlaceholder
              channel={currentChannel}
              currentChart={currentChart}
            />
          ) : (
            <Flex
              justifyContent={'center'}
              boxSizing="border-box"
              alignItems={'center'}
              display={'none'}
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
        <Flex mt={5} justifyContent={'center'} display={'none'}>
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
