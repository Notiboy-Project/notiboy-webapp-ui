import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

interface DropdownMenuProps {
  menus: { title: string; value: string }[];
  onSelectMenu: (menu: string) => void;
  defaultTitle: string;
}

export default function DropdownMenu(props: DropdownMenuProps) {
  const { defaultTitle, onSelectMenu, menus } = props;
  const [title, setTitle] = useState(defaultTitle);

  return (
    <Menu>
      <MenuButton
        width={{ base: '100%', md: '12rem' }}
        bgColor={'gray.800'}
        as={Button}
        rightIcon={<Icon as={FaCaretDown} fill="blue.400" />}
        borderRadius={'3xl'}
        size={'lg'}
        p={5}
      >
        {title}
      </MenuButton>
      <MenuList borderRadius={'3xl'} p={3}>
        {menus.map((menu) => (
          <MenuItem
            key={menu.value}
            minH="48px"
            onClick={() => {
              setTitle(menu.title);
              onSelectMenu(menu.value);
            }}
            p={2}
            borderRadius={'2xl'}
          >
            <Text as="small">{menu.title}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
