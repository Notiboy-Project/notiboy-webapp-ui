import { Box, Icon, Text } from '@chakra-ui/react';
import { Network, NetworkType } from './wallet.types';

interface NetworkListsProps {
  networks: Network[];
  onSelectNetwork: (network: NetworkType) => void;
}

export default function NetworkLists({ networks, onSelectNetwork }: NetworkListsProps) {
  return (
    <>
      <Text fontWeight={'bold'}>Select a Network</Text>
      <Box display={'flex'} alignItems={'center'} gap={10}>
        {networks.map(({ Icon: NetworkIcon, name, title }) => (
          <Box
            mt={5}
            height={{ base: 135, lg: 175 }}
            width={{ base: 135, lg: 175 }}
            borderRadius={10}
            padding={5}
            key={name}
            display={'grid'}
            backgroundColor={'gray.800'}
            placeItems={'center'}
            onClick={() => onSelectNetwork(name)}
          >
            <Icon height={{ base: 10, lg: 20 }} w={{ base: 10, lg: 20 }} fill="blue.400" cursor={'pointer'}>
              {NetworkIcon}
            </Icon>
            <Text>{title}</Text>
          </Box>
        ))}
      </Box>
    </>
  );
}
