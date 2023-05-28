import React from 'react';
import { Avatar, Box, Button, Icon, Text, useToast } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';
import { ChannelsDto } from '../../services/services.types';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';
import {
  fetchChannelUsersLists,
  optIntoChannel,
  optOutChannel
} from '../../services/channels.service';
import { UserContext } from '../../Context/userContext';

interface ChannelListsProps {
  channel: ChannelsDto;
  updateChannelList: () => void;
  handleEditChannel: (channel: ChannelsDto) => void;
  handleDeleteChannel: (appId: string) => void;
}

function ChannelCard(props: ChannelListsProps) {
  const [isUserDownloading, setUserDownloading] = React.useState(false);
  const [optInoutLoading, setOptInoutLoading] = React.useState(false);
  const { channel, handleEditChannel, handleDeleteChannel } = props;
  const { user, refetchUserInfo } = React.useContext(UserContext);

  const { channels = [], optins = [], chain = '', address = '' } = user || {};

  const toast = useToast();

  const imgSrc = `data:image/png;base64, ${channel.logo}`;

  const isUserOptin = (appId: string) => {
    return (optins || [])?.includes(appId);
  };

  const amIOwner = () => {
    return (channels || [])?.includes(channel.app_id);
  };

  const handleDownloadUsers = async () => {
    // TODO: fetch users and create csv file to download
    setUserDownloading(true);
    try {
      const resp = await fetchChannelUsersLists(chain, channel.app_id);
      const { status_code, data } = resp;
      if (status_code === 200) {
        let csvString = `Address \n`;
        csvString += data
          .map((obj: { address: string }) => obj?.address || '')
          ?.join('\n');
        // TODO: create blob file and download it.

        window.URL = window.webkitURL || window.URL;
        const contentType = 'text/csv';
        const csvFile = new Blob([csvString], { type: contentType });

        const a = document.createElement('a');
        a.download = `${channel.name}-addresses.csv`;
        a.href = window.URL.createObjectURL(csvFile);
        a.textContent = 'Download CSV';

        a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
        a.click();
        a.remove();
      }
      setUserDownloading(false);
    } catch (err) {
      console.log('Error downloading users csv ==>', err);
      setUserDownloading(false);
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
        // updateChannelList();
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
        // updateChannelList();
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
    } catch (err: any) {
      toast({
        description:
          err?.response?.data?.message ||
          'Failed to unsubscribe to channel! Please try again',
        duration: 3000,
        isClosable: true,
        status: 'error',
        position: 'top'
      });
      setOptInoutLoading(false);
      console.log('Error while Optout to channels', channel.app_id, err);
    }
  };

  const showOptInOutOption = () => {
    if (isUserOptin(channel.app_id)) {
      return (
        <Button
          isLoading={optInoutLoading}
          backgroundColor={'red.400'}
          borderRadius={'3xl'}
          mt={4}
          size={'sm'}
          onClick={handleOptOut}
        >
          Opt-out
        </Button>
      );
    } else {
      return (
        <Button
          isLoading={optInoutLoading}
          onClick={handleOptIn}
          backgroundColor={'blue.500'}
          borderRadius={'3xl'}
          size={'sm'}
          mt={4}
        >
          Opt-in
        </Button>
      );
    }
  };

  return (
    <CardLayout p={5} mt={4}>
      <Box display={'flex'} alignItems={'center'}>
        <Avatar name="avatar" src={imgSrc} height={'40px'} width={'40px'} />
        <Box
          display={{ base: 'grid', md: 'flex' }}
          alignContent={'center'}
          alignItems={'center'}
        >
          <Text ml={3} fontWeight={600}>
            {channel.name}
          </Text>
        </Box>
        {channel.verified && <Icon as={VerifyIcon} ml={3} />}
      </Box>
      <Text as="p" fontSize={'md'} fontWeight={500} textAlign={'left'} mt={2}>
        {channel.description}
      </Text>
      <Box display={'flex'} justifyContent={'space-between'}>
        {showOptInOutOption()}

        {amIOwner() && (
          <Box display={'flex'} justifyContent={'flex-end'} mt={4}>
            <Button
              onClick={handleDownloadUsers}
              isLoading={isUserDownloading}
              backgroundColor={'blue.500'}
              size="sm"
              borderRadius={'3xl'}
            >
              <Icon as={ImUsers} h={18} w={18} /> &nbsp; Download users
            </Button>
            <Button
              onClick={() => handleDeleteChannel(channel?.app_id)}
              ml={2}
              backgroundColor={'red.400'}
              borderRadius={'3xl'}
              size="sm"
            >
              <Icon as={MdDelete} h={18} w={18} />
            </Button>
            <Button
              onClick={() => handleEditChannel(channel)}
              ml={2}
              backgroundColor={'blue.400'}
              borderRadius={'3xl'}
              size="sm"
            >
              <Icon as={MdEdit} h={18} w={18} />
            </Button>
          </Box>
        )}
      </Box>
    </CardLayout>
  );
}

export default React.memo(ChannelCard);
