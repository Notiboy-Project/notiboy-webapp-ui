import * as React from 'react';
import {
  reconnectProviders,
  initializeProviders,
  WalletProvider,
  PROVIDER_ID
} from '@txnlab/use-wallet';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import PageLoading from './components/Layout/PageLoading';

const ConnectWallet = React.lazy(() => import('./pages/ConnectWallet'));
const NotificationPage = React.lazy(() => import('./pages/Notifications'));

const walletProvider = initializeProviders([PROVIDER_ID.MYALGO]);

export const App = () => {
  React.useEffect(() => {
    // Reconnect the session when the user returns to the dApp
    reconnectProviders(walletProvider);
  }, []);

  return (
    <WalletProvider value={walletProvider}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <BrowserRouter>
            <Routes>
              <Route
                path="/connect-wallet"
                element={
                  <React.Suspense fallback={<PageLoading />}>
                    <ConnectWallet />
                  </React.Suspense>
                }
              />
              <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/notifications" element={<NotificationPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Box>
      </ChakraProvider>
    </WalletProvider>
  );
};
