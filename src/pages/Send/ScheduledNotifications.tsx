import { Box, Button, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { fetchScheduledNotification } from '../../services/notification.service';
import { useContext } from 'react';
import { UserContext } from '../../Context/userContext';
import PageLoading from '../../components/Layout/PageLoading';
import { CardLayout } from '../../components/Layout/CardLayout';
import moment from 'moment';
import { BiEditAlt, BiTrashAlt } from 'react-icons/bi';

export default function ScheduledNotification() {
  const { user } = useContext(UserContext);
  const { data, isLoading } = useSWR(
    { chain: user?.chain, params: '' },
    fetchScheduledNotification,
    {
      fallbackData: []
    }
  );

  console.log({ notifications: data });
  console.log({ isLoading });

  return (
    <Box>
      <Box>
        {isLoading && <PageLoading />}
        {!isLoading && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {data.map((sn) => (
              <CardLayout padding={5}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box display={'flex'} flexDirection={'column'} gap={2}>
                    <Text>{sn.message}</Text>
                    <Text as="i" fontSize={12}>
                      Link: {sn.link}
                    </Text>
                    <Text as={'small'}>
                      Scheduled to:{' '}
                      {`${moment(sn.schedule).format('LLL')}                
                    (${moment(sn.schedule).fromNow(true)})`}
                    </Text>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Button size={'sm'}>
                      <BiEditAlt />
                    </Button>
                    <Button size={'sm'} color={'red.400'}>
                      <BiTrashAlt />
                    </Button>
                  </Box>
                </Box>
              </CardLayout>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
