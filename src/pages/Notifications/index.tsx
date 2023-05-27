import * as React from 'react';
import { Box, Button, Icon, Text, Tooltip } from '@chakra-ui/react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../services/notification.service';
import { NoNotificationIcon } from '../../assets/svgs';
import { UserContext } from '../../Context/userContext';
import PageLoading from '../../components/Layout/PageLoading';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';
import { FaSyncAlt } from 'react-icons/fa';

export default function NotificationPage(props: any) {
  const { user } = React.useContext(UserContext);
  const [text, setText] = React.useState('');
  console.log('user ==>', user);

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
      params: { chain: 'algorand' }
    },
    fetchNotifications,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  if (isLoading || isValidating) {
    return <PageLoading />;
  }

  if (error && !isLoading) {
    return <ResourcesUnavailable />;
  }

  return (
    <Box p={5}>
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
        />
        <Button
          onClick={() => mutate()}
          borderRadius={'full'}
          ml={2}
          bgColor={'blue.400'}
        >
          <Tooltip label="Reload notification">
            <Icon as={FaSyncAlt} fill={'#fff'} />
          </Tooltip>
        </Button>
      </Box>
      <Box mt={5}>
        {(data?.data || [])?.length === 0 && (
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
        {(data?.data || [])?.map((notification: any) => (
          <NotificationCard
            notification={notification}
            key={notification.uuid}
          />
        ))}
      </Box>
    </Box>
  );
}
