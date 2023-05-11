import { Box, Icon } from '@chakra-ui/react';
import { AlgorandIcon } from '../../assets/svgs';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { FiSettings } from 'react-icons/all';
import WalletDropdown from '../Wallets/WalletDropdown';

export default function PrivateHeader() {
  return (
    <Box p={5}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box>
          <Icon h={30} width={30} fill={'blue.400'}>
            <AlgorandIcon />
          </Icon>
        </Box>
        <Box display={'flex'} justifyItems={'ce'}>
          <ColorModeSwitcher />
          <Box
            w={45}
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
          </Box>
          <Box ml={4}>
            <WalletDropdown />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
