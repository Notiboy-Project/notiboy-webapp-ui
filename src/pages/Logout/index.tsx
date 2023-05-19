import { Box } from '@chakra-ui/react';
import PageLoading from '../../components/Layout/PageLoading';
import { useWallet } from '@txnlab/use-wallet';

export default function Logout() {
  const { providers } = useWallet();

  console.log('providers ==>', providers);

  return (
    <Box>
      <PageLoading />
    </Box>
  );
}
