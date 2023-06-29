import { Box, Button, Divider, Flex, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { PlanConfigDto } from '../../../plan-config';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

interface PlanConfigProps {
  plan: PlanConfigDto;
}

export default function PlanConfig(props: PlanConfigProps) {
  const { plan } = props;
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
          <Button size="xs" borderRadius={'full'}>
            Purcahse
          </Button>
        </Flex>
        <Box mt={4} lineHeight={2.2}>
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Channel</span>
            <span>{plan.features.channels}</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Notification retention</span>
            <span>{plan?.features?.notification_days_retentions}d</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Per month Notification</span>
            <span>{plan?.features?.notification_per_month}</span>
          </Text>
          <Divider />
          <Text display={'flex'} justifyContent={'space-between'}>
            <span>Notification length</span>
            <span>{plan?.features?.notification_characters}</span>
          </Text>
          <Divider />
          <Text
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <span>Analytics</span>
            <Icon
              fill={plan?.features?.analytics ? 'green.400' : 'red.400'}
              as={
                plan?.features?.analytics
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
