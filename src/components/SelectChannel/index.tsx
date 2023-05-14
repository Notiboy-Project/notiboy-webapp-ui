import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

export default function SelectChannel(props: any) {
  return (
    <Menu>
      <MenuButton
        bgColor={'gray.800'}
        as={Button}
        rightIcon={<FaCaretDown color='blue' fill='blue.400' />}
        borderRadius={'3xl'}
        size={'lg'}
        p={5}
      >
        Select Channel
      </MenuButton>
      <MenuList borderRadius={'3xl'} p={3}>
        <MenuItem minH="48px" onClick={() => { }} p={2} borderRadius={'2xl'}>
          <Text as='small'>Channel 1</Text>
        </MenuItem>
        <MenuItem minH="40px" onClick={() => { }} p={2} borderRadius={'2xl'}>
          <Text as='small'>Channel 2</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
