import { Box, Text } from '@chakra-ui/react';
import { LineCharUsers } from './LineChart';
import { PieChartStatistics } from './PieChart';

export default function StatisticsPage() {
  return (
    <Box p={5}>
      <Text>Statistics page UI</Text>
      <Box width={'70%'} height={'450px'} margin={'0 auto'}>
        <LineCharUsers />
      </Box>
      <Box width={'70%'} height={'450px'} margin={'25px auto'}>
        <PieChartStatistics />
      </Box>
    </Box>
  );
}
