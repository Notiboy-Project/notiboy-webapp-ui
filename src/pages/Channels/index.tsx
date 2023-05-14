import useSWR from 'swr'
import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import SearchInput from '../../components/SearchInput';
import ChannelLists from './ChannelLists';
import CreateChannelModal from './CreateChannelModal';
import { fetchChannelLists } from '../../services/fetcher.service';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { error, isLoading, data } = useSWR('api/channels/algorand', fetchChannelLists)

  console.log(' channels data ==>', data)
  console.log(' channels error ==>', error)
  console.log(' channels isLoading ==>', isLoading)

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
        <ChannelLists
          data={[{
            name: 'Artifical intelligent channels',
            description: "Hello this is description",
            app_id: 'sdfsdfdf-sdfd',
            owner: '4sdf54f54sf2f2z2f',
            verified: true
          }]} />
      </Box>
      <CreateChannelModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
