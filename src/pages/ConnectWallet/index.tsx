import React from "react";
import { AlgorandIcon, XRPLIcon } from "../../assets/svgs";
import NetworkLists from "./NetworkList";
import { NetworkType } from "./wallet.types";
import LogoNameImage from '../../assets/images/notiboy.png';
import {
  Box,
  Button,
  Hide,
  Icon,
  Image,
  Show,
  Text,
} from '@chakra-ui/react';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import AlgorandWallets from "./AlgorandWallets";
import XRPLWallets from "./XRPLWallets";
import { FaArrowLeft } from "react-icons/fa";


export default function ConnectWalletPage() {

  const [selectedNetwork, setSelectedNetwork] =
    React.useState<NetworkType | null>(null);

  const handleSelectNetwork = (type: NetworkType) => {
    setSelectedNetwork(type);
  };

  const onBackClick = () => {
    setSelectedNetwork(null)
  }

  const renderWallets = (network: NetworkType) => {
    switch (network) {
      case NetworkType.ALGORAND:
        return <AlgorandWallets />
      case NetworkType.XRPL:
        return <XRPLWallets />
      default: return <b>Unknown network</b>
    }
  }

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      width={'100vw'}
    >
      <Box
        backgroundColor={'blackAlpha.400'}
        p={[0, 10]}
        display={'grid'}
        alignContent={'center'}
        placeItems={'center'}
        borderRadius={15}
        width={['95%', '75%', '55%', '45%']}
        position="relative"
      >
        <Show above="md">
          <Image src={ImageLogo} alt="logo" height={75} width={250} />
        </Show>
        <Hide above="md">
          <Image src={LogoNameImage} alt="logo" height={75} width={85} />
        </Hide>
        <Text fontWeight={600} mt={2}>
          Effective Communication on Web3
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
          {selectedNetwork ? (renderWallets(selectedNetwork)) : (
            <NetworkLists
              networks={[
                {
                  name: NetworkType.ALGORAND,
                  title: 'Algorand',
                  Icon: <AlgorandIcon />
                },
                {
                  name: NetworkType.XRPL,
                  title: 'XRPL',
                  Icon: <XRPLIcon />
                }
              ]}
              onSelectNetwork={handleSelectNetwork}
            />
          )}
          {selectedNetwork && (
            <Box display={'grid'} placeItems={'center'} textAlign={'center'}>
              <Text as="small" p={5}>
                By connecting the wallet, you agree to terms & conditions and privacy
                policy.
              </Text>
              <Button onClick={onBackClick}>
                <Icon as={FaArrowLeft}></Icon>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}