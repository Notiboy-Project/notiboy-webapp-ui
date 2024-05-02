import useSWR from 'swr';
import PageLoading from '../../components/Layout/PageLoading';
import moment from 'moment';
import DeleteScheduleModal from './DeleteScheduleModal';
import { Avatar, Box, Button, Icon, Text } from '@chakra-ui/react';
import { fetchScheduledNotification } from '../../services/notification.service';
import { useContext, useState } from 'react';
import { UserContext } from '../../Context/userContext';
import { CardLayout } from '../../components/Layout/CardLayout';
import { BiEditAlt, BiLink, BiTrashAlt } from 'react-icons/bi';
import { capitalizeLetter, renderLogoFromBase64 } from '../../utils';
import { ScheduledNotificationDto } from '../../services/services.types';
import { BsClock } from 'react-icons/bs';
import EditScheduledDrawer from './EditScheduleDrawer';
import { NoNotificationIcon } from '../../assets/svgs';

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
    revalidateIfStale: true,
    revalidateOnFocus: false
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
          <Box
            display={'grid'}
            alignItems={'center'}
            justifyContent={'center'}
            mt={100}
          >
            <Icon h={300} w={300} as={NoNotificationIcon} />
            <Text mt={5} fontSize={28} fontWeight={600}>
              No Scheduled Notification Found!
            </Text>
          </Box>
        )}
        {!isLoading && data.length > 0 && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Text fontWeight={'bold'} fontSize={'xl'}>
              Scheduled Notifications
            </Text>
            {data.map((sn) => (
              <CardLayout padding={5} key={sn.UUID}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box>
                    <Box display={'flex'} gap={3} alignItems={'center'}>
                      <Avatar
                        name={sn.channelName}
                        src={renderLogoFromBase64(sn?.logo || '')}
                        height={45}
                        width={45}
                      />
                      <Box>
                        {sn.channelName}
                        <Box
                          fontSize={12}
                          display={'flex'}
                          alignItems={'center'}
                          gap={1}
                        >
                          <BsClock />
                          <Text>
                            {`${moment(sn.schedule).format(
                              'LLL'
                            )}                
                          (${capitalizeLetter(
                            moment(sn.schedule).fromNow(true)
                          )} to go)`}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      marginTop={2}
                    >
                      <Text fontSize={'md'}>{sn.message}</Text>
                      {sn?.link && (
                        <Text
                          as="a"
                          href={sn.link}
                          fontSize={12}
                          target="_blank"
                          color={'blue.200'}
                          _hover={{ textDecoration: 'underline' }}
                          display={'flex'}
                          gap={1}
                          wordBreak={'break-all'}
                          alignItems={'center'}
                        >
                          <BiLink />
                          {sn.link}
                        </Text>
                      )}
                    </Box>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Button onClick={() => setEditSchedule(sn)} size={'md'}>
                      <BiEditAlt />
                    </Button>
                    <Button
                      onClick={() => setDeleteSchedule(sn)}
                      size={'md'}
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
