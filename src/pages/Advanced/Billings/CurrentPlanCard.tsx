import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { FiAlertCircle } from 'react-icons/fi';
import moment from 'moment';

interface CurrentPlanCardProps {}

export default function CurrentPlanCard(props: CurrentPlanCardProps) {
  return (
    <CardLayout p={5}>
      <Flex flexDirection={'row'} alignItems={'center'} gap={3}>
        <Icon as={FiAlertCircle} fontSize={'xl'} />
        <Text fontSize={'2xl'}>Gold Tier</Text>
        <Text as="sub" fontSize={'xs'}>
          $30 per month
        </Text>
      </Flex>
      <Box
        mt={5}
        display={['grid', 'grid', 'flex']}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        gap={[5, 5, 0]}
      >
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Balance</Text>
          <Text fontSize={'3xl'}>$285</Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Estimated balance exhausion date</Text>
          <Text fontSize={'3xl'}>{moment().format('LL')}</Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Notification remaining</Text>
          <Text fontSize={'3xl'}>{652}</Text>
        </Box>
      </Box>
    </CardLayout>
  );
}
