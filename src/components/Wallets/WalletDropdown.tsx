import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { BiCopy, BiLogOut } from 'react-icons/bi';
import { FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config';
import { CgQr } from 'react-icons/cg';
import QRCodeGenerator from './QrCodeGenerte';
import { useContext } from 'react';
import { UserContext } from '../../Context/userContext';

export default function WalletDropdown() {
  const { user } = useContext(UserContext)
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const walletAddress = user?.address || ''

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress || '');
    toast({
      description: 'Address copied to clipboard!',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  };

  const handleLogout = async () => {
    navigate(routes.logout);
  };

  const handleGenerateQR = () => {
    onOpen();
  };

  const truncatedAddress = `${walletAddress.slice(0, 4)}...
  ${walletAddress?.slice(-3)}`;

  return (
    <>
      <Menu>
        <MenuButton
          bgColor={'blue.300'}
          as={Button}
          rightIcon={<FaCaretDown />}
          borderRadius={'3xl'}
          size={'lg'}
        >
          {truncatedAddress}
        </MenuButton>
        <MenuList
          borderRadius={'3xl'}
          p={3}
          maxWidth={{ base: '315px', md: '100%', xs: '350px' }}
          right={15}
          zIndex={2}
        >
          <MenuItem
            minH="48px"
            onClick={handleCopyAddress}
            p={2}
            borderRadius={'2xl'}
          >
            <Text
              as={'small'}
              maxWidth={'325px'}
              wordBreak={'break-all'}
              textOverflow={'ellipsis'}
            >
              {walletAddress.slice(0, 25)}...
            </Text>
            <Icon ml={2} as={BiCopy} h={6} w={6} />
          </MenuItem>
          <MenuItem
            minH="48px"
            onClick={handleGenerateQR}
            p={2}
            borderRadius={'2xl'}
          >
            Scan QR for Mobile Login
            <Icon ml={2} as={CgQr} h={6} w={6} />
          </MenuItem>
          <MenuItem
            minH="40px"
            onClick={handleLogout}
            p={2}
            borderRadius={'2xl'}
            textAlign={'center'}
          >
            <Text as="small">Logout</Text>
            <Icon ml={2} as={BiLogOut} h={6} w={6} />
          </MenuItem>
        </MenuList>
      </Menu>
      {isOpen && <QRCodeGenerator isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
