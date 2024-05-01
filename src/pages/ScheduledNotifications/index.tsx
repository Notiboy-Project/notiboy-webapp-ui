import useSWR from 'swr';
import PageLoading from '../../components/Layout/PageLoading';
import moment from 'moment';
import DeleteScheduleModal from './DeleteScheduleModal';
import { Avatar, Box, Button, Text } from '@chakra-ui/react';
import { fetchScheduledNotification } from '../../services/notification.service';
import { useContext, useState } from 'react';
import { UserContext } from '../../Context/userContext';
import { CardLayout } from '../../components/Layout/CardLayout';
import { BiEditAlt, BiLink, BiTrashAlt } from 'react-icons/bi';
import { renderLogoFromBase64 } from '../../utils';
import { ScheduledNotificationDto } from '../../services/services.types';
import { BsClock } from 'react-icons/bs';
import EditScheduledDrawer from './EditScheduleDrawer';

export default function ScheduledNotification() {
  const { user } = useContext(UserContext);
  const [deleteSchedule, setDeleteSchedule] =
    useState<ScheduledNotificationDto | null>(null);
  const [editSchedule, setEditSchedule] =
    useState<ScheduledNotificationDto | null>(null);
  const {
    data,
    isLoading,
    mutate: refreshNotification
  } = useSWR({ chain: user?.chain, params: '' }, fetchScheduledNotification, {
    fallbackData: [],
    revalidateOnMount: true
  });

  const handleOnEditSuccess = () => {
    setEditSchedule(null);
    refreshNotification();
  };

  return (
    <Box>
      <Box>
        {isLoading && <PageLoading />}
        {!isLoading && !data.length && (
          <Box textAlign={'center'} marginTop={5}>
            No Scheduled notification found.
          </Box>
        )}
        {!isLoading && data.length > 0 && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Text fontWeight={'bold'} fontSize={'xl'}>
              Scheduled Notifications
            </Text>
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
                      <Text>
                        {sn.channelName}
                        <Text
                          as={'small'}
                          fontSize={11}
                          display={'flex'}
                          alignItems={'center'}
                          gap={1}
                        >
                          <BsClock />
                          <Text textTransform={'capitalize'}>
                            {`${moment(sn.schedule).format(
                              'LLL'
                            )}                
                          (${moment(sn.schedule).fromNow(true)})`}
                          </Text>
                        </Text>
                      </Text>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      marginTop={2}
                    >
                      <Text as="i" fontSize={12}>
                        {sn.message}
                      </Text>
                      {sn?.link && (
                        <Text
                          as="small"
                          display={'flex'}
                          gap={1}
                          alignItems={'center'}
                        >
                          <BiLink />
                          {sn.link}
                        </Text>
                      )}
                    </Box>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Button onClick={() => setEditSchedule(sn)} size={'sm'}>
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
      <EditScheduledDrawer
        isOpen={!!editSchedule}
        onSuccessUpdated={handleOnEditSuccess}
        onClose={() => setEditSchedule(null)}
        scheduled={editSchedule}
      />
    </Box>
  );
}
