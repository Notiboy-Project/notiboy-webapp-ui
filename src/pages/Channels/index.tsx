import useSWR from 'swr'
import SearchInput from '../../components/SearchInput';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import { Box, Button, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { fetchChannelLists } from '../../services/channels.service';
import PageLoading from '../../components/Layout/PageLoading';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { error, isLoading, data, mutate } =
    useSWR('api/channels/algorand', fetchChannelLists)

  console.log(' channels data ==>', data?.data)
  console.log(' channels error ==>', error)
  console.log(' channels isLoading ==>', isLoading)

  if (isLoading)
    return (
      <PageLoading />
    )

  if (!isLoading && error) {
    console.log('Error loading channels', error)
    return (
      <Box mt={20}>
        <Text>Something went wrong! please try again later!</Text>
      </Box>
    )

  }

  return (
    <Box p={5}>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <SearchInput value="" onChange={() => { }} />
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
        {
          data?.data?.map((channel) => (
            <ChannelCard updateChannelList={mutate} channel={channel} />
          ))
        }
      </Box>
      <CreateChannelModal mutate={mutate} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
