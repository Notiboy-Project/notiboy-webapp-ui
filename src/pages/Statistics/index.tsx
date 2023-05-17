import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { LineCharUsers } from './LineChart';
import { PieChartStatistics } from './PieChart';
import { BiArrowFromRight } from 'react-icons/bi';

export default function StatisticsPage() {
  return (
    <Box p={5}>
      <Text>Statistics page UI</Text>
      <Box position={'relative'}>
        <Box width={'70%'} height={'450px'} margin={'0 auto'}>
          <LineCharUsers />
        </Box>
        <Box width={'70%'} height={'450px'} margin={'25px auto'}>
          <PieChartStatistics />
        </Box>
        <Box>
          <Button position={'absolute'} top={'50%'} right={35} colorScheme='secondary'>
            <Icon as={BiArrowFromRight} h={25} w={25} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
