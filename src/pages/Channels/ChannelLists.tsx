import { Avatar, Box, Button, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';
import { ChannelsDto } from './channels.types';

interface ChannelListsProps {
  data: ChannelsDto[]
}

export default function ChannelLists(props: ChannelListsProps) {

  const { data } = props

  return (
    <>
      {data.map((channel) => (
        <CardLayout p={5}>
          <Box display={'flex'} alignItems={'center'}>
            <Avatar name="avatar" src="avtar" height={'40px'} width={'40px'} />
            <Text ml={3}>{channel.name}</Text>
            {channel.verified && (
              <Icon as={VerifyIcon} ml={3} />
            )}
          </Box>
          <Text as="p" fontSize={'md'} fontWeight={500} textAlign={'left'} mt={2}>
            {channel.description}
          </Text>
          <Box>
            <Button backgroundColor={'blue.500'} borderRadius={'3xl'} mt={4}>
              Opt-in
            </Button>
          </Box>
        </CardLayout>
      ))}
    </>

  );
}
