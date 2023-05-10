import { Box, Image, Text } from '@chakra-ui/react';
import NoNotificationImg from '../../assets/images/no-notification.png';

export default function NotificationPage(props: any) {
  return (
    <Box>
      <Text>Notifications</Text>
      <Box display={'grid'} placeItems={'center'} alignContent={'center'} height={'100%'}>
        <Image
          src={NoNotificationImg}
          height={350}
          width={350}
          background="transparent"
        />
      </Box>
    </Box>
  );
}
