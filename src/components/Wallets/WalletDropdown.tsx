import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@txnlab/use-wallet';
import { BiCopy, BiLogOut } from 'react-icons/bi';
import { FaCaretDown } from 'react-icons/fa';

export default function WalletDropdown() {
  const { activeAccount } = useWallet();
  const toast = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeAccount?.address || '');
    toast({
      description: 'Address copied to clipboard!',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  };

  const handleLogout = () => {
    toast({
      description: 'Logging out...',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Menu>
      <MenuButton
        bgColor={'blue.300'}
        as={Button}
        rightIcon={<FaCaretDown />}
        borderRadius={'3xl'}
        size={'lg'}
      >
        {activeAccount?.address.slice(0, 4)}...
        {activeAccount?.address?.slice(-3)}
      </MenuButton>
      <MenuList>
        <MenuItem minH="48px" onClick={handleCopyAddress}>
          <Text as={'small'} textOverflow={'ellipsis'}>
            {activeAccount?.address}
          </Text>
          <Icon ml={2} as={BiCopy} h={6} w={6} />
        </MenuItem>
        <MenuItem minH="40px" onClick={handleLogout}>
          <Text>Logout</Text>
          <Icon ml={2} as={BiLogOut} h={6} w={6} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
