import React from 'react';
import { Box, Button, Icon, Image, Text } from '@chakra-ui/react';
import { NetworkType } from '../../pages/ConnectWallet/wallet.types';
import { FaArrowLeft } from 'react-icons/fa';
import { AlgorandIcon } from '../../assets/svgs';
import { PROVIDER_ID, useWallet } from '@txnlab/use-wallet';

interface NetworkWalletListsProps {
  networkType: NetworkType;
}

export default function NetworkWalletLists(props: NetworkWalletListsProps) {
  const { providers } = useWallet();

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
      case 'Daffi':
        return 'green.500';
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
            <React.Fragment key={provider.metadata.id}>
              <Button
                key={provider.metadata.id}
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
              {provider.metadata.id === PROVIDER_ID.MYALGO && (
                <Text as="small" color={'red.400'}>
                  {provider.metadata.name}: Ledger/Multisig accounts only
                </Text>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </>
  );
}
