import moment from 'moment';
import { Avatar, Box, Icon, Text } from '@chakra-ui/react';
import { NotificationData } from './notification.types';
import { VerifyIcon } from '../../assets/svgs';
import { CardLayout } from '../../components/Layout/CardLayout';

interface NotificationCardProps {
  notification: NotificationData;
}

export default function NotificationCard(props: NotificationCardProps) {
  const { notification } = props;

  const handleRedirect = () => {
    window.open(notification.link, '_blank');
  };

  return (
    <CardLayout
      mt={5}
      p={5}
      onClick={handleRedirect}
      cursor={'pointer'}
      _hover={{ border: '.5px solid lightblue' }}
    >
      <Box display={'flex'} alignItems={'center'}>
        <Avatar
          name="channelName"
          src={'srcFromAppId'}
          height={45}
          width={45}
        />
        <Text fontWeight={600} fontSize={'lg'} textAlign={'left'} ml={3}>
          {notification.appid}
        </Text>
        <Icon ml={3} as={VerifyIcon} h={6} w={6} />
        <Text ml={5} fontWeight={600} as="small" color="gray.600">
          {notification.kind === 'public' ? 'Annoucement' : 'Notifications'}
        </Text>
      </Box>
      <Text as="p" textAlign={'left'} fontSize={'md'} fontWeight={500} p={2}>
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
        {/* <Icon
          h={6}
          w={6}
          as={BiCheckDouble}
          ml={2}
          mr={2}
          fill={notification.seen ? 'blue.500' : 'geay.500'}
        /> */}
      </Text>
    </CardLayout>
  );
}
