import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import api, { apiURL } from '../../services/api.service';

export default function SelectChannel(props: any) {

  const [selectedChannel, setSelectedChannel] = useState('Select Channel')
  const [loading, setLoading] = useState(false)

  const fetchCahnnels = async () => {
    setLoading(true)
    try {
      const resp = await api.get(apiURL.channelListsURL('algorand'))
      console.log("resp.data ==>", resp.data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchCahnnels()
  }, [])


  return (
    <Menu>
      <MenuButton
        bgColor={'gray.800'}
        as={Button}
        rightIcon={<FaCaretDown fill='blue.400' />}
        borderRadius={'3xl'}
        size={'lg'}
        p={5}
        isLoading={loading}
      >
        {selectedChannel}
      </MenuButton>
      <MenuList borderRadius={'3xl'} p={3}>
        <MenuItem minH="48px" onClick={() => { setSelectedChannel('Channel 1') }} p={2} borderRadius={'2xl'}>
          <Text as='small'>Channel 1</Text>
        </MenuItem>
        <MenuItem minH="40px" onClick={() => { }} p={2} borderRadius={'2xl'}>
          <Text as='small'>Channel 2</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
