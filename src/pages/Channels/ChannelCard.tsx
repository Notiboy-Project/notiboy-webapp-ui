import React from 'react';
import { Avatar, Box, Button, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';
import { ChannelsDto } from '../../services/services.types';
import { MdDelete } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';

interface ChannelListsProps {
  channel: ChannelsDto
}

function ChannelCard(props: ChannelListsProps) {

  const { channel } = props

  const imgSrc = `data:image/png;base64, ${channel.logo}`

  return (
    <CardLayout p={5} mt={4}>
      <Box display={'flex'} alignItems={'center'}>
        <Avatar name="avatar" src={imgSrc} height={'40px'} width={'40px'} />
        <Text ml={3}>{channel.name}</Text>
        {channel.verified && (
          <Icon as={VerifyIcon} ml={3} />
        )}
      </Box>
      <Text as="p" fontSize={'md'} fontWeight={500} textAlign={'left'} mt={2}>
        {channel.description}
      </Text>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Button backgroundColor={'blue.500'} borderRadius={'3xl'} mt={4}>
          Opt-in
        </Button>
        <Button backgroundColor={'red.400'} borderRadius={'3xl'} mt={4}>
          Opt-out
        </Button>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button backgroundColor={'blue.500'} borderRadius={'3xl'} mt={4}>
            <Icon as={ImUsers} h={18} w={18} /> &nbsp;
            Download users
          </Button>
          <Button ml={2} backgroundColor={'red.400'} borderRadius={'3xl'} mt={4}>
            <Icon as={MdDelete} h={18} w={18} />
            Delete Channel
          </Button>
        </Box>
      </Box>
    </CardLayout>
  );
}

export default React.memo(ChannelCard)