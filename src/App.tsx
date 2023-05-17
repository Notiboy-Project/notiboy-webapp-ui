import * as React from 'react';
import {
  reconnectProviders,
  initializeProviders,
  WalletProvider,
  PROVIDER_ID
} from '@txnlab/use-wallet';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import PageLoading from './components/Layout/PageLoading';
import { routes } from './config';
import UserContextProvider from './Context/userContext';

const ConnectWallet = React.lazy(() => import('./pages/ConnectWallet'));
const NotificationPage = React.lazy(() => import('./pages/Notifications'));
const ChannelsPage = React.lazy(() => import('./pages/Channels'));
const SendPage = React.lazy(() => import('./pages/Send'));
const StatisticsPage = React.lazy(() => import('./pages/Statistics'));
const SupportPage = React.lazy(() => import('./pages/Support'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));

const walletProvider = initializeProviders([
  PROVIDER_ID.MYALGO,
  PROVIDER_ID.DEFLY,
  PROVIDER_ID.PERA,
  PROVIDER_ID.WALLETCONNECT
]);

const theme = extendTheme({  
  config:{
    initialColorMode: 'dark'
  }
})

export const App = () => {
  React.useEffect(() => {
    // Reconnect the session when the user returns to the dApp
    reconnectProviders(walletProvider);
  }, []);

  return (
    <WalletProvider value={walletProvider}>
      <UserContextProvider>
        <ChakraProvider theme={theme}>
          {/* <Box> */}
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={routes.notifications} />}
                />
                <Route
                  path={routes.connectWallet}
                  element={
                    <React.Suspense fallback={<PageLoading />}>
                      <ConnectWallet />
                    </React.Suspense>
                  }
                />
                <Route path="/" element={<ProtectedRoutes />}>
                  <Route
                    path={routes.notifications}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <NotificationPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path={routes.channels}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <ChannelsPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path={routes.send}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <SendPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path={routes.statistics}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <StatisticsPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path={routes.support}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <SupportPage />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path={routes.settings}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <SettingsPage />
                      </React.Suspense>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          {/* </Box> */}
        </ChakraProvider>
      </UserContextProvider>
    </WalletProvider>
  );
};
