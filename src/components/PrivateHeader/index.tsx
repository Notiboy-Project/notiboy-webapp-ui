import { useContext } from 'react'
import { Box, Button, Hide, Icon, Image, Show } from '@chakra-ui/react';
// import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { FiSettings } from 'react-icons/all';
import WalletDropdown from '../Wallets/WalletDropdown';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config';
import ChainLogo from '../UI/ChainLogo';
import NotiboyLogo from '../../assets/images/notiboy.png';
import { UserContext } from '../../Context/userContext';

export default function PrivateHeader() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <Box p={{ base: 2, md: 5 }}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box>
          <Show below="md">
            <Image src={NotiboyLogo} height={50} width={50} />
          </Show>
          <Hide below="md">
            <ChainLogo chain={user?.chain} />
          </Hide>
        </Box>
        <Box display={'flex'} justifyItems={'center'}>
          {/* <ColorModeSwitcher /> */}
          <Button
            w={45}
            onClick={() => navigate(routes.settings)}
            h={45}
            backgroundColor={'blue.400'}
            p={2}
            ml={4}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={'full'}
          >
            <Icon h={25} width={25} as={FiSettings} />
          </Button>
          <Box ml={4}>
            <WalletDropdown />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
