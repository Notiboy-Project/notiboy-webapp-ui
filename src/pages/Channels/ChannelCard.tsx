import React from 'react';
import { Avatar, Box, Button, Icon, Text, useToast } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';
import { ChannelsDto } from '../../services/services.types';
import { MdDelete } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';
import {
  deleteChannel,
  fetchChannelUsersLists,
  optIntoChannel,
  optOutChannel
} from '../../services/channels.service';
import { UserContext } from '../../Context/userContext';

interface ChannelListsProps {
  channel: ChannelsDto;
  updateChannelList: () => void;
}

function ChannelCard(props: ChannelListsProps) {
  const [isDeleting, setDeleting] = React.useState(false);
  const [isUserDownloading, setUserDownloading] = React.useState(false);
  const [optInoutLoading, setOptInoutLoading] = React.useState(false);
  const { channel, updateChannelList } = props;
  const { user, refetchUserInfo } = React.useContext(UserContext);

  const { channels = [], optins = [], chain = '', address = '' } = user || {};

  const toast = useToast();

  const imgSrc = `data:image/png;base64, ${channel.logo}`;

  const isUserOptin = (appId: string) => {
    return optins?.includes(appId) || channels.includes(appId);
  };

  const amIOwner = () => {
    return channels?.includes(channel.app_id);
  };

  const handleDownloadUsers = async () => {
    // TODO: fetch users and create csv file to download
    setUserDownloading(true);
    try {
      const resp = await fetchChannelUsersLists('algorand', channel.app_id);
      const { status_code } = resp;
      if (status_code === 200) {
        // TODO: create blob file and download it.
      }
      setUserDownloading(false);
      console.log('resp ==>', resp);
    } catch (err) {
      console.log('Error fetching users ==>', err);
      setUserDownloading(false);
    }
  };

  const handleDeleteChannel = async () => {
    // TODO: delete channel API call and update lists
    setDeleting(true);
    try {
      const resp = await deleteChannel('algorand', channel.app_id);
      const { status_code } = resp;
      if (status_code === 200) {
        toast({
          description: `'${channel.name}'Channel deleted !`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        updateChannelList();
      }
      console.log('delete response', resp);
    } catch (err) {
      console.log('Error deleting channel', err);
      setDeleting(false);
    }
  };

  const handleOptIn = async () => {
    // TODO: call optin apis to optin
    try {
      setOptInoutLoading(true);
      const resp = await optIntoChannel(chain, channel.app_id, address);
      if (resp.status_code === 200) {
        toast({
          description: 'Subscribed Successfully!',
          duration: 3000,
          isClosable: true,
          status: 'success',
          position: 'top'
        });
        refetchUserInfo();
        updateChannelList();
      } else {
        toast({
          description: 'Failed to subscribe to channel! Please try again',
          duration: 3000,
          isClosable: true,
          status: 'error',
          position: 'top'
        });
      }
      setOptInoutLoading(false);
    } catch (err) {
      setOptInoutLoading(false);
      console.log('Error while Optin to channels', channel.app_id, err);
    }
  };

  const handleOptOut = async () => {
    // TODO: call optin apis to optin
    try {
      setOptInoutLoading(true);
      const resp = await optOutChannel(chain, channel.app_id, address);
      if (resp.status_code === 200) {
        toast({
          description: 'Unsubscribed Successfully!',
          duration: 3000,
          isClosable: true,
          status: 'success',
          position: 'top'
        });
        refetchUserInfo();
        updateChannelList();
      } else {
        toast({
          description: 'Failed to unsubscribe to channel! Please try again',
          duration: 3000,
          isClosable: true,
          status: 'error',
          position: 'top'
        });
      }
      setOptInoutLoading(false);
    } catch (err) {
      setOptInoutLoading(false);
      console.log('Error while Optout to channels', channel.app_id, err);
    }
  };

  const showOptInOutOption = () => {
    if (amIOwner()) {
      return null;
    }

    if (isUserOptin(channel.app_id)) {
      <Button
        isLoading={optInoutLoading}
        backgroundColor={'red.400'}
        borderRadius={'3xl'}
        mt={4}
        onClick={handleOptOut}
      >
        Opt-out
      </Button>;
    } else {
      <Button
        isLoading={optInoutLoading}
        onClick={handleOptIn}
        backgroundColor={'blue.500'}
        borderRadius={'3xl'}
        mt={4}
      >
        Opt-in
      </Button>;
    }
  };

  return (
    <CardLayout p={5} mt={4}>
      <Box display={'flex'} alignItems={'center'}>
        <Avatar name="avatar" src={imgSrc} height={'40px'} width={'40px'} />
        <Text ml={3}>{channel.name}</Text>
        <Text ml={2} as="small">
          ({channel.app_id})
        </Text>
        {channel.verified && <Icon as={VerifyIcon} ml={3} />}
      </Box>
      <Text as="p" fontSize={'md'} fontWeight={500} textAlign={'left'} mt={2}>
        {channel.description}
      </Text>
      <Box display={'flex'} justifyContent={'space-between'}>
        {showOptInOutOption()}

        {amIOwner() && (
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button
              onClick={handleDownloadUsers}
              isLoading={isUserDownloading}
              backgroundColor={'blue.500'}
              borderRadius={'3xl'}
              mt={4}
            >
              <Icon as={ImUsers} h={18} w={18} /> &nbsp; Download users
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
        )}
      </Box>
    </CardLayout>
  );
}

export default React.memo(ChannelCard);
