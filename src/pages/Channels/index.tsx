import React, { useCallback, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import _debounce from 'lodash.debounce';
import useSWRInfinite from 'swr/infinite';
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import {
  Box,
  Button,
  Flex,
  Icon,
  Switch,
  Text,
  useDisclosure
} from '@chakra-ui/react';
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
import { pageSize } from '../../config';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isVerified, setIsverified] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [editChannel, setEditChannel] = useState<ChannelsDto | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const { user } = useContext(UserContext);

  const getKey = (pageIndex: number, previousPageData: any) => {
    // reached the end
    if (
      previousPageData?.pagination_meta_data &&
      !previousPageData?.pagination_meta_data?.next
    )
      return null;

    const params = new URLSearchParams();
    params.set('page_size', pageSize.channels.toString());
    params.set('logo', 'true');

    if (filter === 'all') {
      params.set('verified', isVerified.toString());
    }

    if (searchText.trim().length > 1 && filter === 'all') {
      params.set('name', searchText);
    }

    // first page, we don't have `previousPageData`
    if (pageIndex === 0)
      return {
        param: `?${params.toString()}`,
        chain: user?.chain
      };

    params.set('page_state', previousPageData?.pagination_meta_data?.next);
    // add the cursor to the API endpoint
    return {
      chain: user?.chain,
      param: `?${params.toString()}`
    };
  };

  const { data, mutate, size, setSize, isLoading, error, isValidating } =
    useSWRInfinite(getKey, fetchChannelLists, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false
    });

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
      if (filter === 'all') {
        return __data || [];
      }

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
    [filter]
  );

  const renderLoadMoreButton = () => {
    if (filter !== 'all') return null;

    const lastData = data?.[data?.length - 1];

    if (!lastData || !lastData?.pagination_meta_data?.next) return null;

    return (
      <Flex mt={5} alignItems={'center'} justifyContent={'center'}>
        <Button isLoading={isValidating} onClick={() => setSize(size + 1)}>
          Load more
        </Button>
      </Flex>
    );
  };

  const debounceRequests = _debounce(setSearchText, 600);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouceCallback = useCallback(debounceRequests, []);

  const handleSetText = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    debouceCallback(value);
    setText(value);
  };

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
          const verified = data?.data?.filter((c) => c.verified === true);
          const unverified = data?.data?.filter((c) => c.verified === false);
          const records = [...verified, ...unverified];
          return acc.concat(records || []);
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

  if (!isLoading && error) {
    console.log('Error loading channels', error);
    return <ResourcesUnavailable />;
  }

  return (
    <Box>
      <Box display={{ base: 'grid', md: 'flex' }} alignItems={'center'} gap={4}>
        <SearchInput
          value={text}
          onChange={handleSetText}
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
        <Flex gap={4} alignItems={'center'}>
          {filter === 'all' && (
            <Flex
              border={'1px solid gray'}
              py={2}
              px={4}
              borderRadius={'full'}
              alignItems={'center'}
              gap={2}
            >
              <Text fontWeight={600}>Verified</Text>
              <Switch
                isChecked={isVerified}
                onChange={({ currentTarget }) =>
                  setIsverified(currentTarget.checked)
                }
                size="lg"
              />
            </Flex>
          )}
          <Button
            h={38}
            backgroundColor="blue.400"
            size="lg"
            minW={'12rem'}
            width={{ base: '100%', xs: '100%', md: 'fit-content' }}
            p={'1.4rem 2rem'}
            fontWeight={600}
            borderRadius={'full'}
            onClick={onOpen}
          >
            <Icon h={8} w={8} as={BsPlus} fill={'#fff'} fontWeight={600} />
            Create Channel
          </Button>
        </Flex>
      </Box>
      <Box mt={4}>
        {(ownedLoading || optinLoading || isLoading) && <PageLoading />}
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
        {renderLoadMoreButton()}
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
