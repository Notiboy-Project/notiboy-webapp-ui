import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { FiAlertCircle } from 'react-icons/fi';
import moment from 'moment';
import { PlanConfigDto } from '../../../plan-config';
import AddBalanceModal from './AddBalanceModal';

interface CurrentPlanCardProps {
  balance: number;
  currentPlan: PlanConfigDto | null;
  expiryDate: string;
  notificationRemaining: number;
  syncBillingInfo: () => void;
}

export default function CurrentPlanCard(props: CurrentPlanCardProps) {
  const {
    balance,
    currentPlan,
    expiryDate,
    notificationRemaining,
    syncBillingInfo = () => {}
  } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const expiry = moment(expiryDate);
  const formattedDate = expiry.isValid() ? expiry.format('LL') : '--';

  return (
    <CardLayout p={5}>
      <Flex
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Flex flexDirection={'row'} alignItems={'center'} gap={3}>
          <Icon as={FiAlertCircle} fontSize={'xl'} />
          <Text fontSize={'2xl'} textTransform={'capitalize'}>
            {currentPlan?.key || 'Free'}
          </Text>
          <Text as="sub" fontSize={'xs'}>
            ${currentPlan?.price || 0} per month
          </Text>
        </Flex>
        <Box>
          <Button
            size="sm"
            bg="blue.400"
            borderRadius={'full'}
            onClick={onOpen}
          >
            Add balance
          </Button>
        </Box>
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
          <Text fontSize={'3xl'}>${Number(balance || 0).toFixed(2)}</Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Estimated balance exhausion date</Text>
          <Text fontSize={'3xl'}>
            {currentPlan?.key === 'free' ? 'N/A' : formattedDate}
          </Text>
        </Box>
        <Box display={'flex'} flexDirection={'column'} placeItems={'center'}>
          <Text fontSize={'md'}>Notification remaining</Text>
          <Text fontSize={'3xl'}>{notificationRemaining || 0}</Text>
        </Box>
      </Box>
      <AddBalanceModal
        onAddBalanceSucceeded={syncBillingInfo}
        isOpen={isOpen}
        onClose={onClose}
      />
    </CardLayout>
  );
}
