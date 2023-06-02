import { useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import {
  fetchChannelLists,
  fetchOptedInChannels,
  fetchOwnedChannels
} from '../../services/channels.service';
import PageLoading from '../../components/Layout/PageLoading';
import { ChannelsDto } from '../../services/services.types';
import DeleteChannelModal from './DeleteChannelModal';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';
import { UserContext } from '../../Context/userContext';
import DropdownMenu from '../../components/DropdownMenu';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [editChannel, setEditChannel] = useState<ChannelsDto | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ChannelsDto[]>([]);
  const { user } = useContext(UserContext);

  const { error, isLoading, data, mutate } = useSWR(
    filter === 'all' ? `api/channels/${user?.chain}` : null,
    fetchChannelLists,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const { data: ownedChannels, isLoading: ownedLoading } = useSWR(
    filter === 'owned'
      ? { chain: user?.chain || '', address: user?.address || '' }
      : null,
    fetchOwnedChannels,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const { data: optinChannles = [], isLoading: optinLoading } = useSWR(
    filter === 'optin'
      ? { chain: user?.chain, address: user?.address, logo: true }
      : null,
    fetchOptedInChannels,
    {
      revalidateOnFocus: false
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

  const applyFiltersOnData = useCallback(
    (searchText: string, filter: string) => {
      let __data: ChannelsDto[] = [];

      if (filter === 'all') {
        __data = data?.data || [];
      }
      if (filter === 'owned') {
        __data = ownedChannels?.data || [];
      }

      if (filter === 'optin') {
        __data = optinChannles || [];
      }

      if (__data && __data?.length > 0 && searchText?.trim()?.length > 1) {
        filterBytext(__data || [], searchText);
      } else {
        setFilteredData(__data || []);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, ownedChannels, filter, optinChannles]
  );

  useEffect(() => {
    applyFiltersOnData(searchText, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, filter, data, ownedChannels, optinChannles]);

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
          placeholder="Search channels here.."
        />
        <DropdownMenu
          menus={[
            { title: 'All', value: 'all' },
            { title: 'Owned', value: 'owned' },
            { title: 'Optin', value: 'optin' }
          ]}
          onSelectMenu={setFilter}
          defaultTitle="All"
        />
        <Button
          h={38}
          minW={'13rem'}
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
        {(ownedLoading || optinLoading) && <PageLoading />}
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
