import { Box, useToast } from '@chakra-ui/react';
import PageLoading from '../../components/Layout/PageLoading';
import { useWallet } from '@txnlab/use-wallet';
import { useCallback, useEffect } from 'react';
import { routes } from '../../config';
import {
  removeCurrentUser,
  removeTokenFromStorage
} from '../../services/storage.service';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { providers, status } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    if (status === 'disconnected') {
      removeTokenFromStorage();
      removeCurrentUser();
      navigate(routes.connectWallet, { replace: true });
      return;
    }

    if (status === 'active') {
      const connectedWallet = providers?.find((wallet) => wallet.isConnected);
      removeTokenFromStorage();
      removeCurrentUser();

      if (connectedWallet) {
        await connectedWallet?.disconnect();
        toast({
          description: 'Logged out !',
          status: 'info',
          duration: 1500,
          isClosable: true,
          position: 'top',
          id: 'logout'
        });
        navigate(routes.connectWallet, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers, status]);

  useEffect(() => {
    if (status !== 'initializing') {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, providers]);

  return (
    <Box>
      <PageLoading />
    </Box>
  );
}
