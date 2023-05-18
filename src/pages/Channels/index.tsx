import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Icon,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { fetchChannelLists } from '../../services/channels.service';
import PageLoading from '../../components/Layout/PageLoading';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { error, isLoading, data, mutate } = useSWR(
    'api/channels/algorand',
    fetchChannelLists
  );

  if (isLoading) return <PageLoading />;

  if (!isLoading && error) {
    console.log('Error loading channels', error);
    return (
      <Box
        display={'flex'}
        alignItems={'center'}
        height={'80%'}
        width={{ base: '100%', sm: '70%' }}
        margin={'0 auto'}
      >
        <Alert status="error" borderRadius={'2xl'}>
          <AlertIcon />
          <AlertTitle>
            Resources are not available at the moment! Try again later!
          </AlertTitle>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <SearchInput value="" onChange={() => {}} />
        <Button
          h={38}
          ml={4}
          w={38}
          backgroundColor="blue.400"
          size="xl"
          p={5}
          borderRadius={'full'}
          onClick={onOpen}
        >
          <Icon h={8} w={8} as={BsPlus} fill={'#fff'} fontWeight={600} />
        </Button>
      </Box>
      <Box mt={4}>
        {data?.data?.length === 0 && (
          <Box mt={20} height={'100%'}>
            <Text fontSize={'2xl'}>No channels found !</Text>
          </Box>
        )}
        {data?.data?.map((channel) => (
          <ChannelCard
            key={channel.app_id}
            updateChannelList={mutate}
            channel={channel}
          />
        ))}
      </Box>
      <CreateChannelModal mutate={mutate} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
