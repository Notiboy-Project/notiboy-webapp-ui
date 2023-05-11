import * as React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import { useWallet } from '@txnlab/use-wallet';
import { routes } from '../../config';
import NetworkLists from './NetworkList';
import { AlgorandIcon } from '../../assets/svgs';
import { NetworkType } from './wallet.types';
import NetworkWalletLists from '../../components/Wallets/NetworkWalletList';

export default function WalletConnect(props: any) {
  const { activeAccount } = useWallet();
  const [selectedNetwork, setSelectedNetwork] =
    React.useState<NetworkType | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (activeAccount && activeAccount.address) {
      navigate(routes.notifications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  const handleSelectNetwork = (type: NetworkType) => {
    setSelectedNetwork(type);
  };

  // console.log('activeAccount', activeAccount);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={['100vh', '80vh']}
      width={['100vw']}
    >
      <Box
        backgroundColor={'blackAlpha.400'}
        p={10}
        display={'grid'}
        alignContent={'center'}
        placeItems={'center'}
        borderRadius={15}
        width={['95%', '75%', '65%']}
      >
        <ColorModeSwitcher />
        <Image src={ImageLogo} alt="logo" height={75} width={250} />
        <Text fontWeight={600} mt={2} as="small">
          Web3 communication made efficient
        </Text>
        <Box
          mt={5}
          backgroundColor={'gray.700'}
          p={15}
          borderRadius={10}          
          display={'grid'}
          width={'100%'}
          alignContent={'center'}
          placeItems={'center'}
        >
            {selectedNetwork ? (
              <NetworkWalletLists
                networkType={selectedNetwork}
                onBackClick={() => setSelectedNetwork(null)}
              />
            ) : (
              <NetworkLists
                networks={[
                  {
                    name: NetworkType.ALGORAND,
                    title: 'Algorand',
                    Icon: <AlgorandIcon />
                  }
                ]}
                onSelectNetwork={handleSelectNetwork}
              />
            )}
        </Box>
      </Box>
    </Box>
  );
}
