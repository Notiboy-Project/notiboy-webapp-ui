import {
  Box,
  Icon,
  Text
} from '@chakra-ui/react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../services/fetcher.service';
import { NoNotificationIcon } from '../../assets/svgs';

export default function NotificationPage(props: any) {
  const {
    error,
    isLoading,
    data = [
      {
        message: 'a message text',
        link: 'https://xyz.com',
        appid: '51235',
        time: '2021-01-01T00:00:00.000Z',
        hash: 'MTIzNDU2Nzg5MA==',
        uuid: '550e8400-e29b-11d4-a716-446655440000',
        kind: 'public',
        seen: true
      }
    ]
  } = useSWR(
    {
      url: `api/notifications`,
      params: { chain: 'algorand' }
    },
    fetchNotifications
  );

  console.log('error', error);
  console.log('isLoading', isLoading);
  console.log('data ==>', data);

  return (
    <Box p={5}>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
        height={'100%'}
      >
        <SearchInput onChange={() => {}} value="" />
      </Box>
      <Box mt={5}>
        {data?.length === 0 && (
          <Box
            display={'grid'}
            alignItems={'center'}
            justifyContent={'center'}
            mt={100}
          >
            <Icon h={300} w={300} as={NoNotificationIcon} />
            <Text mt={5} fontSize={28} fontWeight={600}>
              No Notification Yet!
            </Text>
          </Box>
        )}
        {data.map((notification: any) => (
          <NotificationCard
            notification={notification}
            key={notification.uuid}
          />
        ))}
      </Box>
    </Box>
  );
}
