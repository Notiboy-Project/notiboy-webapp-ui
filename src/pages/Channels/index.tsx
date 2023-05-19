import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import {  
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { fetchChannelLists } from '../../services/channels.service';
import PageLoading from '../../components/Layout/PageLoading';
import { useState } from 'react';
import { ChannelsDto } from '../../services/services.types';
import DeleteChannelModal from './DeleteChannelModal';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editChannel, setEditChannel] = useState<ChannelsDto | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);

  const { error, isLoading, data, mutate } = useSWR(
    'api/channels/algorand',
    fetchChannelLists
  );

  const handleEditChannel = (channel: ChannelsDto) => {
    setEditChannel(channel);
    onOpen();
  };

  const handleCloseModal = () => {
    setEditChannel(null);
    onClose();
  };

  if (isLoading) return <PageLoading />;

  if (!isLoading && error) {
    console.log('Error loading channels', error);
    return <ResourcesUnavailable />;
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
          <Flex
            mt={20}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Text fontSize={'2xl'}>No channels found !</Text>
          </Flex>
        )}
        {data?.data?.map((channel) => (
          <ChannelCard
            key={channel.app_id}
            updateChannelList={mutate}
            channel={channel}
            handleEditChannel={handleEditChannel}
            handleDeleteChannel={setDeleteAppId}
          />
        ))}
      </Box>
      <CreateChannelModal
        channel={editChannel}
        mutate={mutate}
        isOpen={isOpen}
        onClose={handleCloseModal}
      />
      <DeleteChannelModal
        appId={deleteAppId}
        isOpen={!!deleteAppId}
        onClose={() => setDeleteAppId(null)}
        updateChannelList={mutate}
      />
    </Box>
  );
}
