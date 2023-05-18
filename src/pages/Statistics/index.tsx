import { Box, Button, Icon, Text } from '@chakra-ui/react';
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
      <Text>Statistics page UI</Text>
      <Box position={'relative'} mt={5}>
        <Box width={{base: '95%', md: '90%', xl: '80%'}} minH={'550px'} margin={'0 auto'}>
          {currentChart === ChartType.LINE_CHART && <LineCharUsers />}
          {currentChart === ChartType.PIE_CHART && <PieChartStatistics />}
        </Box>
        <Box>
          <Button
            position={'absolute'}
            rounded={'full'}
            top={'45%'}
            left={-5}
            display={currentChart === ChartType.LINE_CHART ? 'none': 'flex'}
            onClick={() => setCurrentChart(ChartType.LINE_CHART)}
            size={'lg'}
            padding={'15px'}
          >
            <Icon as={AiOutlineLeftCircle} h={30} w={25} fill="blue.400" />
          </Button>
          <Button
            position={'absolute'}
            rounded={'full'}
            display={currentChart === ChartType.PIE_CHART ? 'none': 'flex'}
            top={'45%'}
            right={-5}
            onClick={() => setCurrentChart(ChartType.PIE_CHART)}
            size={'lg'}
            padding={'15px'}
          >
            <Icon as={AiOutlineRightCircle} h={30} w={25} fill="blue.400" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
