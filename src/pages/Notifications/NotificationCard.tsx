import moment from 'moment';
import { Avatar, Box, Icon, Text } from '@chakra-ui/react';
import { NotificationData } from './notification.types';
import { VerifyIcon } from '../../assets/svgs';
import { CardLayout } from '../../components/Layout/CardLayout';
import { ChannelsDto } from '../../services/services.types';

interface NotificationCardProps {
  notification: NotificationData;
  channels: ChannelsDto[];
}

export default function NotificationCard(props: NotificationCardProps) {
  const { notification, channels } = props;

  const handleRedirect = () => {
    if (!notification.link) return;

    window.open(notification.link, '_blank');
  };

  const getLogo = (appId: string) => {
    const logoBase64 = channels?.find((c) => c.app_id === appId)?.logo || '';
    return `data:image/png;base64, ${logoBase64}`;
  };

  const isChennelVerified = (appId: string) => {
    return channels.find((c) => c.app_id === appId)?.verified || false;
  };

  return (
    <CardLayout
      mt={5}
      p={5}
      onClick={handleRedirect}
      cursor={notification.link ? 'pointer' : '-moz-initial'}
      _hover={{ border: '.5px solid lightblue' }}
    >
      <Box display={'flex'} alignItems={'center'}>
        <Avatar
          name={notification.channel_name}
          src={getLogo(notification.app_id)}
          height={45}
          width={45}
        />
        <Text fontWeight={600} fontSize={'lg'} textAlign={'left'} ml={3}>
          {notification.channel_name}
        </Text>
        {isChennelVerified(notification.app_id) && (
          <Icon ml={3} as={VerifyIcon} h={6} w={6} />
        )}
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
        {moment(notification.created_time).format('LLL')}
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
