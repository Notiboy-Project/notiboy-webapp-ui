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
import UserContextProvider from './Context/userContext';
import { routes } from './config';
import NotFound404 from './components/Layout/NotFound404';

const ConnectWallet = React.lazy(() => import('./pages/ConnectWallet'));
const NotificationPage = React.lazy(() => import('./pages/Notifications'));
const ChannelsPage = React.lazy(() => import('./pages/Channels'));
const SendPage = React.lazy(() => import('./pages/Send'));
const StatisticsPage = React.lazy(() => import('./pages/Statistics'));
const SupportPage = React.lazy(() => import('./pages/Support'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const LogoutPage = React.lazy(() => import('./pages/Logout'));
const AdvancePage = React.lazy(() => import('./pages/Advanced'));

const walletProvider = initializeProviders([
  PROVIDER_ID.DEFLY,
  PROVIDER_ID.PERA,
  PROVIDER_ID.DAFFI,
  PROVIDER_ID.WALLETCONNECT,
  PROVIDER_ID.MYALGO
]);

const theme = extendTheme({
  config: {
    initialColorMode: 'dark'
  }
});

export type PrivateRoutesType = {
  name: string,
  path: string,
  component: React.LazyExoticComponent<(props: any) => JSX.Element>
}

const PRIVATE_ROUTES: PrivateRoutesType[] = [
  { name: 'channels', path: routes.channels, component: ChannelsPage },
  { name: 'notifications', path: routes.notifications, component: NotificationPage },
  { name: 'send', path: routes.send, component: SendPage },
  { name: 'statistics', path: routes.statistics, component: StatisticsPage },
  { name: 'settings', path: routes.settings, component: SettingsPage },
  { name: 'support', path: routes.support, component: SupportPage },
  { name: 'advance_api_access', path: routes.advanced, component: AdvancePage },
]

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
              <Route
                path={routes.logout}
                element={
                  <React.Suspense fallback={<PageLoading />}>
                    <LogoutPage />
                  </React.Suspense>
                }
              />
              <Route path="/" element={<ProtectedRoutes />}>
                {PRIVATE_ROUTES.map(({ component: Component, path, name }) => (
                  <Route
                    key={name}
                    path={path}
                    element={
                      <React.Suspense fallback={<PageLoading />}>
                        <Component />
                      </React.Suspense>
                    }
                  />
                ))}
              </Route>
              <Route path='*' element={<NotFound404 />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </UserContextProvider>
    </WalletProvider>
  );
};
