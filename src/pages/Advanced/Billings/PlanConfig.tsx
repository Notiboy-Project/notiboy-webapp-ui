import { Box, Button, Divider, Flex, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { PlanConfigDto, PlanKey } from '../../../plan-config';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

interface PlanConfigProps {
  plan: PlanConfigDto;
  isActive: boolean;
  onSwitchPlan: (newPlan: PlanKey) => void;
}

export default function PlanConfig(props: PlanConfigProps) {
  const { plan, isActive, onSwitchPlan } = props;
  return (
    <CardLayout p={4} minWidth={'280px'}>
      <Box width={'100%'}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Text
              fontSize={'2xl'}
              fontWeight={'bold'}
              textTransform={'capitalize'}
            >
              {plan.key}
            </Text>
            <Text fontSize={'md'}>${plan?.price} per month</Text>
          </Box>
          {isActive && (
            <Text color={'green.400'} fontWeight={600}>
              Active
            </Text>
          )}
          {!isActive && plan.key !== 'free' && (
            <Button
              onClick={() => onSwitchPlan(plan?.key)}
              colorScheme="teal"
              variant={'outline'}
              size="xs"
              borderRadius={'full'}
            >
              Subscribe
            </Button>
          )}
        </Flex>
        <Box mt={4} lineHeight={2.2}>
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>{plan.features.channels > 1 ? 'Channels' : 'Channel'}</span>
            <span>{plan.features.channels}</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Notification Retention</span>
            <span>{plan?.features?.notification_days_retentions} days</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Monthly Notification Limit</span>
            <span>{plan?.features?.notification_per_month}</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Notification Length</span>
            <span>{plan?.features?.notification_characters} characters</span>
          </Text>
          <Divider />
          <Text
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <span>Analytics</span>
            <Icon
              fill={
                plan?.features?.optin_optout_analytics ? 'green.400' : 'red.400'
              }
              as={
                plan?.features?.optin_optout_analytics
                  ? AiFillCheckCircle
                  : AiFillCloseCircle
              }
              fontSize={'xl'}
            />
          </Text>
        </Box>
      </Box>
    </CardLayout>
  );
}
