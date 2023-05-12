import { Box, Icon, Text } from '@chakra-ui/react';
import { NotificationData } from './notification.types';
import { AlgorandIcon } from '../../assets/svgs';
import moment from 'moment';
import { BiCheckDouble } from 'react-icons/bi';

interface NotificationCardProps {
  notification: NotificationData;
}

export default function NotificationCard(props: NotificationCardProps) {
  const { notification } = props;

  return (
    <Box p={2} bgColor={'gray.800'} borderRadius={'xl'} mt={5}>
      <Box display={'flex'} alignItems={'center'}>
        <Box bg={'#fff'} borderRadius={'full'} width={35} p={1}>
          <Icon as={AlgorandIcon} h={15} w={15} fill="blue.500" />
        </Box>
        <Text fontWeight={600} fontSize={'lg'} textAlign={'left'} ml={5}>
          {notification.appid}
        </Text>
      </Box>
      <Text as="p" textAlign={'left'} fontSize={'md'} fontWeight={600} p={2}>
        {notification.message}
      </Text>
      <Text
        as={'p'}
        textAlign={'right'}
        fontSize={'sm'}
        fontWeight={600}
        color="gray.500"
        display={'flex'}
        alignItems={'center'}
        justifyContent={'flex-end'}
      >
        {moment(notification.time).format('LLL')}
        <Icon
          h={6}
          w={6}
          as={BiCheckDouble}
          ml={2}
          mr={2}
          fill={notification.seen ? 'blue.500' : 'geay.500'}  
        />
      </Text>
    </Box>
  );
}
