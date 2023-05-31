import { useEffect, useState } from 'react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { fetchChannelLists } from '../../services/channels.service';
import PageLoading from '../../components/Layout/PageLoading';
import { ChannelsDto } from '../../services/services.types';
import DeleteChannelModal from './DeleteChannelModal';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState('');
  const [editChannel, setEditChannel] = useState<ChannelsDto | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ChannelsDto[]>([]);

  const { error, isLoading, data, mutate } = useSWR(
    'api/channels/algorand',
    fetchChannelLists,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const handleEditChannel = (channel: ChannelsDto) => {
    setEditChannel(channel);
    onOpen();
  };

  const filterBytext = (channels: ChannelsDto[], text: string) => {
    if (!channels || text?.trim()?.length === 0) return;

    const str = text.trim()?.toLowerCase();
    const fdata = channels?.filter(
      (channel) =>
        channel?.name?.toLowerCase()?.includes(str) ||
        channel?.description?.toLowerCase()?.includes(str)
    );
    setFilteredData(fdata);
  };

  const handleCloseModal = () => {
    setEditChannel(null);
    onClose();
  };

  useEffect(() => {
    if (
      data?.data &&
      data?.data?.length > 0 &&
      searchText?.trim()?.length > 1
    ) {
      filterBytext(data?.data || [], searchText);
    } else {
      setFilteredData(data?.data || []);
    }
  }, [data, searchText]);

  if (isLoading) return <PageLoading />;

  if (!isLoading && error) {
    console.log('Error loading channels', error);
    return <ResourcesUnavailable />;
  }

  return (
    <Box>
      <Box
        display={{ base: 'grid', md: 'flex' }}
        justifyContent={'center'}
        alignItems={'center'}
        gap={4}
      >
        <SearchInput
          value={searchText}
          onChange={({ currentTarget }) => setSearchText(currentTarget.value)}
        />
        <Button
          h={38}
          backgroundColor="blue.400"
          size="lg"
          p={'1.4rem 2.2rem'}
          fontWeight={600}
          borderRadius={'full'}
          onClick={onOpen}
        >
          <Icon h={8} w={8} as={BsPlus} fill={'#fff'} fontWeight={600} />
          Create Channel
        </Button>
      </Box>
      <Box mt={4}>
        {filteredData?.length === 0 && (
          <Flex
            mt={20}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Text fontSize={'2xl'}>No channels found !</Text>
          </Flex>
        )}
        {filteredData?.map((channel) => (
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
