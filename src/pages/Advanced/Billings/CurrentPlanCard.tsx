import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { FiAlertCircle } from 'react-icons/fi';
import moment from 'moment';
import { PlanConfigDto } from '../../../plan-config';

interface CurrentPlanCardProps {
  balance: number;
  currentPlan: PlanConfigDto | null;
  expiryDate: string;
  notificationRemaining: number;
}

export default function CurrentPlanCard(props: CurrentPlanCardProps) {
  const { balance, currentPlan, expiryDate, notificationRemaining } = props;

  const expiry = moment(expiryDate);
  console.log(`Expiry ==> `, expiry);
  const formattedDate = expiry.isValid() ? expiry.format('LL') : '--';

  return (
    <CardLayout p={5}>
      <Flex flexDirection={'row'} alignItems={'center'} gap={3}>
        <Icon as={FiAlertCircle} fontSize={'xl'} />
        <Text fontSize={'2xl'} textTransform={'capitalize'}>
          {currentPlan?.key || 'Free'}
        </Text>
        <Text as="sub" fontSize={'xs'}>
          ${currentPlan?.price || 0} per month
        </Text>
      </Flex>
      <Box
        mt={5}
        display={{ base: 'grid', xl: 'flex' }}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        gap={5}
      >
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Balance</Text>
          <Text fontSize={'3xl'}>${balance}</Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Estimated balance exhausion date</Text>
          <Text fontSize={'3xl'}>{formattedDate}</Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Notification remaining</Text>
          <Text fontSize={'3xl'}>{notificationRemaining || 0}</Text>
        </Box>
      </Box>
    </CardLayout>
  );
}
