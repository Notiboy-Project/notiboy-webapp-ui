import { Box, Flex, Text } from '@chakra-ui/react';
import CurrentPlanCard from './CurrentPlanCard';
import { PLAN_CONFIG } from '../../../plan-config';
import PlanConfig from './PlanConfig';

export default function Billings() {
  return (
    <Box width={'100%'}>
      <CurrentPlanCard />
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
    </Box>
  );
}
