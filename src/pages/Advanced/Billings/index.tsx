import useSWR from 'swr';
import { Box, Flex, Text } from '@chakra-ui/react';
import CurrentPlanCard from './CurrentPlanCard';
import {
  PLAN_CONFIG,
  getPlanByKey,
  updateConfigsWithServer
} from '../../../plan-config';
import PlanConfig from './PlanConfig';
import PaymentHistory from './PaymentHistory';
import {
  fetchBillingInfo,
  fetchPlansDetails
} from '../../../services/users.service';
import { useContext, useMemo } from 'react';
import { UserContext } from '../../../Context/userContext';
import PageLoading from '../../../components/Layout/PageLoading';

export default function Billings() {
  const { user } = useContext(UserContext);
  const { isLoading, data } = useSWR(
    { chain: user?.chain || '', user: user?.address || '' },
    fetchBillingInfo,
    {
      revalidateOnFocus: false,
      errorRetryCount: 4
    }
  );

  const { data: plansData } = useSWR('/billing', fetchPlansDetails, {
    revalidateOnFocus: false
  });

  console.log('plansData: ', plansData);

  const plansConfig = useMemo(() => {
    if (plansData?.data) {
      return updateConfigsWithServer(plansData?.data);
    } else {
      return PLAN_CONFIG;
    }
  }, [plansData]);

  const { data: billing } = data || {};

  if (isLoading || !billing) {
    return (
      <Flex justifyContent={'center'} w={'100%'}>
        <PageLoading />
      </Flex>
    );
  }

  const currentPlan = getPlanByKey(billing.membership);

  return (
    <Box width={'100%'}>
      <Box width={{ base: '100%', md: '100%', xl: '75%' }} mx={'auto'}>
        <CurrentPlanCard
          balance={billing.balance || 0}
          currentPlan={currentPlan}
          expiryDate={billing.expiry}
          notificationRemaining={billing.remaining_notifications}
        />
      </Box>
      <Text fontWeight={600} textAlign={'center'} fontSize={'2xl'} my={5}>
        Plans
      </Text>
      <Flex
        mt={5}
        flexDirection={['column', 'column', 'column', 'row']}
        gap={5}
        justifyContent={'center'}
      >
        {plansConfig.map((plan) => (
          <PlanConfig
            isActive={plan?.key === currentPlan?.key}
            plan={plan}
            key={plan.key}
          />
        ))}
      </Flex>
      <Box mt={5}>
        <PaymentHistory data={billing?.billing_records || []} />
      </Box>
    </Box>
  );
}
