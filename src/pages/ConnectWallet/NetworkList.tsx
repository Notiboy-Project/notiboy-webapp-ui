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
          height={175}
          width={175}
          borderRadius={10}
          padding={5}
          key={name}
          display={'grid'}
          backgroundColor={'gray.800'}
          placeItems={'center'}
          onClick={() => onSelectNetwork(name)}
        >
          <Icon height={20} w={20} fill="blue.400" cursor={'pointer'}>
            {NetworkIcon}
          </Icon>
          <Text>{title}</Text>
          {/* <Text>{provider.metadata.id}</Text> */}
        </Box>
      ))}
      </Box>
    </>
  );
}
