import useSWR from 'swr';
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { UserContext } from '../../Context/userContext';
import { fetchChannelsByUser } from '../../services/channels.service';
import { BiLockAlt } from 'react-icons/bi';

interface SelectChannelProps {
  onChannelSelect: (appId: string) => void;
}

export default function SelectChannel({ onChannelSelect }: SelectChannelProps) {
  const [selectedChannel, setSelectedChannel] = useState('Select Channel');
  const { user } = useContext(UserContext);

  const { isLoading, data } = useSWR(
    `api/${user?.chain}/${user?.address}`,
    fetchChannelsByUser,
    {
      revalidateOnFocus: false
    }
  );

  useEffect(() => {
    if (data && data?.length > 0) {
      const activeChannel = data.find((c) => c.status === 'ACTIVE');
      if (activeChannel) {
        setSelectedChannel(activeChannel.name);
        onChannelSelect(activeChannel.app_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Menu>
      <MenuButton
        bgColor={'gray.800'}
        as={Button}
        rightIcon={<Icon as={FaCaretDown} fill="blue.400" />}
        borderRadius={'3xl'}
        size={'lg'}
        p={5}
        isLoading={isLoading}
        width="100%"
      >
        {selectedChannel}
      </MenuButton>
      <MenuList borderRadius={'3xl'} p={3}>
        {data?.length === 0 && <MenuItem disabled>No channels found!</MenuItem>}
        {(data || []).map((channel) => {
          const isDisabled = channel.status !== 'ACTIVE';
          return (
            <MenuItem
              minH="48px"
              onClick={() => {
                setSelectedChannel(channel.name);
                onChannelSelect(channel.app_id);
              }}
              isDisabled={isDisabled}
              key={channel.app_id}
              p={2}
              borderRadius={'2xl'}
            >
              {isDisabled && <Icon as={BiLockAlt} h={15} mr={2} />}
              <Text as="small">{channel.name}</Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
