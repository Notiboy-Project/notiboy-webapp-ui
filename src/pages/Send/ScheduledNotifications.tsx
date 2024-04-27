import { Avatar, Box, Button, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { fetchScheduledNotification } from '../../services/notification.service';
import { useContext, useState } from 'react';
import { UserContext } from '../../Context/userContext';
import PageLoading from '../../components/Layout/PageLoading';
import { CardLayout } from '../../components/Layout/CardLayout';
import moment from 'moment';
import { BiEditAlt, BiTrashAlt } from 'react-icons/bi';
import { renderLogoFromBase64 } from '../../utils';
import DeleteScheduleModal from './DeleteScheduleModal';
import { ScheduledNotificationDto } from '../../services/services.types';

export default function ScheduledNotification() {
  const { user } = useContext(UserContext);
  const [deleteSchedule, setDeleteSchedule] =
    useState<ScheduledNotificationDto | null>(null);
  const {
    data,
    isLoading,
    mutate: refreshNotification
  } = useSWR({ chain: user?.chain, params: '' }, fetchScheduledNotification, {
    fallbackData: [],
    revalidateOnFocus: true
  });

  console.log({ notifications: data });
  console.log({ isLoading });

  return (
    <Box>
      <Box>
        {isLoading && <PageLoading />}
        {!isLoading && !data.length && (
          <Box textAlign={'center'} marginTop={5}>
            No Scheduled notification found.
          </Box>
        )}
        {!isLoading && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {data.map((sn) => (
              <CardLayout padding={5}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box>
                    <Box display={'flex'} gap={3} alignItems={'center'}>
                      <Avatar
                        name={sn.channelName}
                        src={renderLogoFromBase64(sn?.logo || '')}
                        height={45}
                        width={45}
                      />
                      <Text>{sn.channelName}</Text>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={0.5}
                      marginTop={2}
                    >
                      <Text as="i" fontSize={12}>
                        {sn.message}
                      </Text>
                      <Text as="small">{sn.link}</Text>
                      <Text as={'small'} display={'flex'}>
                        <Text textTransform={'capitalize'}>
                          {`${moment(sn.schedule).format('LLL')}                
                    (${moment(sn.schedule).fromNow(true)})`}
                        </Text>
                      </Text>
                    </Box>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Button size={'sm'}>
                      <BiEditAlt />
                    </Button>
                    <Button
                      onClick={() => setDeleteSchedule(sn)}
                      size={'sm'}
                      color={'red.400'}
                    >
                      <BiTrashAlt />
                    </Button>
                  </Box>
                </Box>
              </CardLayout>
            ))}
          </Box>
        )}
      </Box>
      <DeleteScheduleModal
        isOpen={!!deleteSchedule}
        onClose={() => setDeleteSchedule(null)}
        onDeleteSuccess={refreshNotification}
        schedule={deleteSchedule}
      />
    </Box>
  );
}
