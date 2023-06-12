import * as React from 'react';
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../services/notification.service';
import { NoNotificationIcon } from '../../assets/svgs';
import { UserContext } from '../../Context/userContext';
import PageLoading from '../../components/Layout/PageLoading';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';
import { FaSyncAlt } from 'react-icons/fa';
import { fetchOptedInChannels } from '../../services/channels.service';
import {
  REFRESH_NOTIFICATIONS,
  subscribe,
  unsubscribe
} from '../../services/events.service';

export default function NotificationPage() {
  const { user } = React.useContext(UserContext);
  const [text, setText] = React.useState('');

  const {
    error,
    isLoading,
    isValidating,
    data = {
      status_code: 200,
      data: []
    },
    mutate
  } = useSWR(
    {
      url: `api/notifications`,
      params: { chain: user?.chain }
    },
    fetchNotifications,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const { data: channels = [] } = useSWR(
    { chain: user?.chain, address: user?.address, logo: true },
    fetchOptedInChannels,
    {
      revalidateOnFocus: false
    }
  );

  const onMessageRecieved = () => {
    // Mutate and update the notification lists
    console.log('Calling refresh notifications');
    mutate();
  };

  React.useEffect(() => {
    subscribe(REFRESH_NOTIFICATIONS, onMessageRecieved);

    return () => {
      console.log('Unsubscribe refresh notifications');
      unsubscribe(REFRESH_NOTIFICATIONS, onMessageRecieved);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = React.useMemo(() => {
    let notifications = data?.data?.slice() || [];
    const searchStr = text?.trim() || '';

    if (notifications.length === 0 || searchStr?.length === 0)
      return notifications;

    const fData = notifications.filter(
      (n) =>
        n?.channel_name?.toLowerCase()?.includes(searchStr?.toLowerCase()) ||
        n?.message?.toLowerCase()?.includes(searchStr?.toLowerCase())
    );
    return fData;
  }, [data?.data, text]);

  if (isLoading || isValidating) {
    return <PageLoading />;
  }

  if (error && !isLoading) {
    return <ResourcesUnavailable />;
  }

  return (
    <Box>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
        height={'100%'}
        alignItems={'center'}
      >
        <SearchInput
          onChange={({ currentTarget }) => setText(currentTarget.value)}
          value={text}
          placeholder="Search notifications..."
        />
        <Button
          onClick={() => mutate()}
          borderRadius={'full'}
          ml={2}
          bgColor={'blue.400'}
        >
          <Icon as={FaSyncAlt} fill={'#fff'} />
        </Button>
      </Box>
      <Box mt={5}>
        {(filteredData || [])?.length === 0 && (
          <Box
            display={'grid'}
            alignItems={'center'}
            justifyContent={'center'}
            mt={100}
          >
            <Icon h={300} w={300} as={NoNotificationIcon} />
            <Text mt={5} fontSize={28} fontWeight={600}>
              No Notification Found!
            </Text>
          </Box>
        )}
        {(filteredData || [])?.map((notification: any) => (
          <NotificationCard
            notification={notification}
            key={notification.uuid}
            channels={channels}
          />
        ))}
      </Box>
    </Box>
  );
}
