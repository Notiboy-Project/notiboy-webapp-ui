import React from 'react';
import { Avatar, Box, Button, Icon, Text, useToast } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';
import { ChannelsDto } from '../../services/services.types';
import { MdDelete } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';
import { deleteChannel, fetchChannelUsersLists } from '../../services/channels.service';

interface ChannelListsProps {
  channel: ChannelsDto
  updateChannelList: () => void
}

function ChannelCard(props: ChannelListsProps) {

  const [isDeleting, setDeleting] = React.useState(false)
  const [isUserDownloading, setUserDownloading] = React.useState(false)
  const { channel, updateChannelList } = props
  const toast = useToast()

  const imgSrc = `data:image/png;base64, ${channel.logo}`

  const handleDownloadUsers = async () => {
    // TODO: fetch users and create csv file to download
    setUserDownloading(true)
    try {
      const resp = await fetchChannelUsersLists('algorand', channel.app_id)
      const { status_code } = resp
      if (status_code === 200) {
        // TODO: create blob file and download it.
      }
      console.log("resp ==>", resp)
    } catch (err) {
      console.log("Error fetching users ==>", err)
      setUserDownloading(false)
    }

  }

  const handleDeleteChannel = async () => {
    // TODO: delete channel API call and update lists
    setDeleting(true)
    try {
      const resp = await deleteChannel('algorand', channel.app_id)
      const { status_code } = resp
      if (status_code === 200) {
        toast({
          description: `'${channel.name}'Channel deleted !`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        })
        updateChannelList()
      }
      console.log("delete response", resp)

    } catch (err) {
      console.log("Error deleting channel", err);
      setDeleting(false)
    }

  }

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
          <Button
            onClick={handleDownloadUsers}
            isLoading={isUserDownloading}
            backgroundColor={'blue.500'}
            borderRadius={'3xl'} mt={4}
          >
            <Icon as={ImUsers} h={18} w={18} /> &nbsp;
            Download users
          </Button>
          <Button
            onClick={handleDeleteChannel}
            isLoading={isDeleting}
            ml={2}
            backgroundColor={'red.400'}
            borderRadius={'3xl'}
            mt={4}
          >
            <Icon as={MdDelete} h={18} w={18} />
            Delete Channel
          </Button>
        </Box>
      </Box>
    </CardLayout>
  );
}

export default React.memo(ChannelCard)