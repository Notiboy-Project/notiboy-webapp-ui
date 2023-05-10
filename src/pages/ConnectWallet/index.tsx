import * as React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import { useWallet } from '@txnlab/use-wallet';
import { routes } from '../../constants';

export default function WalletConnect(props: any) {
  const { providers, activeAccount } = useWallet();

  const navigate = useNavigate()

  React.useEffect(() => {
    if(activeAccount && activeAccount.address) {
      navigate(routes.notifications)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount])

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
        p={5}
        display={'grid'}
        alignContent={'center'}
        placeItems={'center'}
        borderRadius={15}
        width={['95%', '75%', '65%']}
      >
        <ColorModeSwitcher />
        <Image src={ImageLogo} alt="logo" height={75} width={250} />
        <Text fontWeight={600} mt={2} as="small">Web3 communication made efficient</Text>
        <Box
          mt={5}
          backgroundColor={'gray.700'}
          p={10}
          borderRadius={5}          
        >
          <Text fontWeight={'bold'}>Select a Network</Text>
          {providers?.map((provider) => (
            <Box mt={5} height={150} width={150} key={provider.metadata.id} display={'grid'} placeItems={'center'}>
              <Image height={20} w={20} src={provider.metadata.icon} cursor={'pointer'} onClick={provider.connect} />                              
              <Text>{provider.metadata.name}</Text>
              {/* <Text>{provider.metadata.id}</Text> */}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
