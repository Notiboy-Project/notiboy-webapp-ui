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
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config';
import { removeTokenFromStorage } from '../../services/storage.service';

export default function WalletDropdown() {
  const { activeAccount, providers } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    const connectedWallet = providers?.find((wallet) => wallet.isConnected);

    toast({
      description: 'Logged out !',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top'
    });
    removeTokenFromStorage();
    if (connectedWallet) {
      await connectedWallet.disconnect();
      navigate(routes.connectWallet);
    }
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
      <MenuList borderRadius={'3xl'} p={3}>
        <MenuItem minH="48px" onClick={handleCopyAddress} p={2} borderRadius={'2xl'}>
          <Text as={'small'} textOverflow={'ellipsis'}>
            {activeAccount?.address}
          </Text>
          <Icon ml={2} as={BiCopy} h={6} w={6} />
        </MenuItem>
        <MenuItem minH="40px" onClick={handleLogout} p={2} borderRadius={'2xl'}>
          <Text as='small'>Logout</Text>
          <Icon ml={2} as={BiLogOut} h={6} w={6} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
