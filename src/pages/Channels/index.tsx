import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import SearchInput from '../../components/SearchInput';
import ChannelLists from './ChannelLists';
import CreateChannelModal from './CreateChannelModal';

export default function ChannelsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <ChannelLists />
      </Box>
      <CreateChannelModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
