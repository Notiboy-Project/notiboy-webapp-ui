import useSWR from 'swr';
import { Box, Flex, Text } from '@chakra-ui/react';
import CurrentPlanCard from './CurrentPlanCard';
import { PLAN_CONFIG } from '../../../plan-config';
import PlanConfig from './PlanConfig';
import PaymentHistory from './PaymentHistory';
import { fetchBillingInfo } from '../../../services/users.service';
import { useContext } from 'react';
import { UserContext } from '../../../Context/userContext';

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

  console.log('data ==> billing ==>', data);
  console.log('data ==> isLoading ==>', isLoading);

  return (
    <Box width={'100%'}>
      <Box width={{ base: '100%', md: '100%', xl: '75%' }} mx={'auto'}>
        <CurrentPlanCard />
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
        {PLAN_CONFIG.map((plan) => (
          <PlanConfig plan={plan} key={plan.key} />
        ))}
      </Flex>
      <Box mt={5}>
        <PaymentHistory />
      </Box>
    </Box>
  );
}
