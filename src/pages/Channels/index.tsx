import { useCallback, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
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
import {
  ChannelListsResponse,
  ChannelsDto
} from '../../services/services.types';
import DeleteChannelModal from './DeleteChannelModal';
import ResourcesUnavailable from '../../components/Layout/ResourceUnavailable';
import { UserContext } from '../../Context/userContext';
import DropdownMenu from '../../components/DropdownMenu';

const getKey = (pageIndex: number, previousPageData: any) => {
  console.log('pageIndex', pageIndex);
  console.log('previousPageData', previousPageData);
  // reached the end
  if (previousPageData && !previousPageData?.pagination_meta_data?.next)
    return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `?page_size=5&logo=true`;

  // add the cursor to the API endpoint
  return `?page_state=${previousPageData?.pagination_meta_data?.next}&page_size=5&logo=true`;
};
export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [editChannel, setEditChannel] = useState<ChannelsDto | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const { user } = useContext(UserContext);

  const { data, mutate, size, setSize, isLoading, error } = useSWRInfinite(
    getKey,
    fetchChannelLists,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const {
    data: ownedChannels,
    isLoading: ownedLoading,
    mutate: updateOwnedChannels
  } = useSWR(
    filter === 'owned'
      ? { chain: user?.chain || '', address: user?.address || '' }
      : null,
    fetchOwnedChannels,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const {
    data: optinChannles = [],
    isLoading: optinLoading,
    mutate: updateOptinChannels
  } = useSWR(
    filter === 'optin'
      ? { chain: user?.chain, address: user?.address, logo: true }
      : null,
    fetchOptedInChannels,
    {
      revalidateOnFocus: false
    }
  );

  console.log('All data ==>', data);

  const handleEditChannel = (channel: ChannelsDto) => {
    setEditChannel(channel);
    onOpen();
  };

  const handleCloseModal = () => {
    setEditChannel(null);
    onClose();
  };

  const applyFiltersOnData = useCallback(
    (__data: ChannelsDto[], searchText: string) => {
      if (__data && __data?.length > 0 && searchText?.trim()?.length > 1) {
        const str = searchText.trim()?.toLowerCase();
        const fdata = __data?.filter(
          (channel) =>
            channel?.name?.toLowerCase()?.includes(str) ||
            channel?.description?.toLowerCase()?.includes(str)
        );
        return fdata;
      } else {
        return __data || [];
      }
    },
    []
  );

  const updateChannelList = useCallback(() => {
    if (filter === 'all') {
      mutate();
    } else if (filter === 'owned') {
      updateOwnedChannels();
    } else if (filter === 'optin') {
      // TODO call murate functino
      updateOptinChannels();
    } else {
      console.log('Invaid filter value', filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Memoized the expensive calculation to
  // avoid  unnecessary re-calculations
  // and re-rendering the component.
  const filteredData = useMemo(() => {
    let __data: ChannelsDto[] = [];
    if (filter === 'all') {
      __data =
        data?.reduce((acc: ChannelsDto[], data: ChannelListsResponse) => {
          return acc.concat(data?.data || []);
        }, []) || [];
    }
    if (filter === 'owned') {
      __data = ownedChannels || [];
    }

    if (filter === 'optin') {
      __data = optinChannles || [];
    }

    return applyFiltersOnData(__data, searchText);
  }, [
    ownedChannels,
    optinChannles,
    data,
    filter,
    searchText,
    applyFiltersOnData
  ]);

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
            { title: 'Opted In', value: 'optin' }
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
        <Button onClick={() => setSize(size + 1)}>Load more</Button>
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
        updateChannelList={updateChannelList}
      />
    </Box>
  );
}
