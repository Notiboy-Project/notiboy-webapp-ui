import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { UserContext } from '../../Context/userContext';

export default function SelectChannel(props: any) {
  const [selectedChannel, setSelectedChannel] = useState('Select Channel');

  const { user } = useContext(UserContext);

  const { channels = [] } = user || {};

  return (
    <Menu>
      <MenuButton
        bgColor={'gray.800'}
        as={Button}
        rightIcon={<Icon as={FaCaretDown} fill="blue.400" />}
        borderRadius={'3xl'}
        size={'lg'}
        p={5}
        width="100%"
      >
        {selectedChannel}
      </MenuButton>
      <MenuList borderRadius={'3xl'} p={3}>
        {channels?.length === 0 && <MenuItem>No channels found!</MenuItem>}
        {(channels || []).map((channel) => (
          <MenuItem
            minH="48px"
            onClick={() => {
              setSelectedChannel(channel);
            }}
            p={2}
            borderRadius={'2xl'}
          >
            <Text as="small">{channel}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
