import { Box, Button, Icon, Image, Text } from '@chakra-ui/react';
import { NetworkType } from '../../pages/ConnectWallet/wallet.types';
import { FaArrowLeft } from 'react-icons/fa';
import { AlgorandIcon } from '../../assets/svgs';
import { useWallet } from '@txnlab/use-wallet';

interface NetworkWalletListsProps {
  networkType: NetworkType;
  onBackClick: () => void;
}

export default function NetworkWalletLists(props: NetworkWalletListsProps) {
  const { networkType, onBackClick } = props;
  const { providers } = useWallet();
  console.log(networkType);

  const getBg = (name: string) => {
    switch (name) {
      case 'MyAlgo':
        return '#3b56ea';
      case 'Pera':
        return '#3b56ea';
      case 'Defly':
        return '#faa500';
      case 'WalletConnect':
        return '#b741a7';
      default:
        return '#3a57ea';
    }
  };

  return (
    <>
      <Box display={'grid'} placeItems={'center'}>
        <Icon mt={4} fill="blue.400" h={45} w={45}>
          <AlgorandIcon />
        </Icon>
        <Text mt={4} fontWeight={'bold'}>
          Connect a Wallet
        </Text>
        <Box display={'grid'} placeItems={'center'} gap={3} mt={2}>
          {providers?.map((provider) => (
            <Button
              size={'lg'}
              color={'#fff'}
              backgroundColor={getBg(provider.metadata.name)}
              width={{ xs: '100%', sm: '100%', md: '50%', xl: '40%' }}
              justifyContent={'space-between'}
              rightIcon={
                <Image src={provider.metadata.icon} height={35} width={35} />
              }
              colorScheme="linkedin"
              onClick={provider.connect}
              minW={275}
            >
              {provider?.metadata?.name}
            </Button>
          ))}
        </Box>
        <Text as="small" mt={2}>
          By connecting your wallet, you are agree to terms and conditions and
          privacy
        </Text>
        <Button mt={4} onClick={onBackClick}>
          <Icon as={FaArrowLeft}></Icon>
        </Button>
      </Box>
    </>
  );
}
