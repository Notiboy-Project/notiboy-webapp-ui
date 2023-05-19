import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { LineCharUsers } from './LineChart';
import { PieChartStatistics } from './PieChart';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import { useState } from 'react';

export enum ChartType {
  LINE_CHART,
  PIE_CHART
}

export default function StatisticsPage() {
  const [currentChart, setCurrentChart] = useState(ChartType.LINE_CHART);

  return (
    <Box p={5}>
      <Box mt={5}>
        <Box
          width={{ base: '95%', md: '90%', xl: '80%' }}
          margin={'0 auto'}
          maxHeight={'550px'}
        >
          {currentChart === ChartType.LINE_CHART && <LineCharUsers />}
          {currentChart === ChartType.PIE_CHART && <PieChartStatistics />}
        </Box>
        <Flex mt={5} justifyContent={'center'}>
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
        </Flex>
      </Box>
    </Box>
  );
}
