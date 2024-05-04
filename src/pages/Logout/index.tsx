import { Box, useToast } from '@chakra-ui/react';
import PageLoading from '../../components/Layout/PageLoading';
import { useWallet } from '@txnlab/use-wallet';
import { useCallback, useEffect } from 'react';
import { routes } from '../../config';
import {
  removeCurrentUser,
  removeTokenFromStorage,
  removeUserAddressFromStorage
} from '../../services/storage.service';
import xummService from '../../services/xumm.service';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { providers, status } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    removeCurrentUser();
    removeTokenFromStorage();
    removeUserAddressFromStorage();

    if (status === 'active') {
      providers?.forEach((wallet) => {
        wallet?.disconnect();
      });
      removeCurrentUser();
    }

    if (xummService.logout) {
      xummService?.logout();
    }

    toast({
      description: 'Logged out !',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top',
      id: 'logout'
    });
    navigate(routes.connectWallet, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers, status]);

  useEffect(() => {
    if (status === 'active') {
      handleLogout();
    }

    if (status === 'disconnected') {
      navigate(routes.connectWallet, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, providers]);

  return (
    <Box>
      <PageLoading />
    </Box>
  );
}
