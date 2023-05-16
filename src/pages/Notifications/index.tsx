import * as React from 'react';
import {
  Box,
  Icon,
  Text
} from '@chakra-ui/react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../services/notification.service';
import { NoNotificationIcon } from '../../assets/svgs';
import { UserContext } from '../../Context/userContext';

export default function NotificationPage(props: any) {

  const { user } = React.useContext(UserContext)
  console.log("user ==>", user);

  const {
    error,
    isLoading,
    data = {
      status_code: 200,
      data: []
    }
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
        <SearchInput onChange={() => { }} value="" />
      </Box>
      <Box mt={5}>
        {data?.data?.length === 0 && (
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
        {data?.data?.map((notification: any) => (
          <NotificationCard
            notification={notification}
            key={notification.uuid}
          />
        ))}
      </Box>
    </Box>
  );
}
