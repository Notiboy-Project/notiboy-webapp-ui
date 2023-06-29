import * as React from 'react';
import algosdk from 'algosdk';
import {
  useInitializeProviders,
  WalletProvider,
  PROVIDER_ID
} from '@txnlab/use-wallet';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import PageLoading from './components/Layout/PageLoading';
import UserContextProvider from './Context/userContext';
import { envs, routes } from './config';
import NotFound404 from './components/Layout/NotFound404';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';

const ConnectWallet = React.lazy(() => import('./pages/ConnectWallet'));
const NotificationPage = React.lazy(() => import('./pages/Notifications'));
const ChannelsPage = React.lazy(() => import('./pages/Channels'));
const SendPage = React.lazy(() => import('./pages/Send'));
const StatisticsPage = React.lazy(() => import('./pages/Statistics'));
const SupportPage = React.lazy(() => import('./pages/Support'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const LogoutPage = React.lazy(() => import('./pages/Logout'));
const AdvancePage = React.lazy(() => import('./pages/Advanced'));

const theme = extendTheme({
  config: {
    initialColorMode: 'dark'
  }
});

export type PrivateRoutesType = {
  name: string;
  path: string;
  component: React.LazyExoticComponent<(props: any) => JSX.Element>;
};

const PRIVATE_ROUTES: PrivateRoutesType[] = [
  { name: 'channels', path: routes.channels, component: ChannelsPage },
  {
    name: 'notifications',
    path: routes.notifications,
    component: NotificationPage
  },
  { name: 'send', path: routes.send, component: SendPage },
  { name: 'statistics', path: routes.statistics, component: StatisticsPage },
  { name: 'settings', path: routes.settings, component: SettingsPage },
  { name: 'support', path: routes.support, component: SupportPage },
  { name: 'advance_api_access', path: routes.advanced, component: AdvancePage }
];

export const App = () => {
  const walletProvider = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
      {
        id: PROVIDER_ID.WALLETCONNECT,
        clientStatic: WalletConnectModalSign,
        clientOptions: {
          projectId: envs.walletConnectProjectId || '',
          metadata: {
            name: 'Notiboy',
            description: 'Notiboy Dapp',
            url: '#',
            icons: []
          }
        }
      },
      { id: PROVIDER_ID.EXODUS }
    ],
    algosdkStatic: algosdk,
    debug: process.env.NODE_ENV === 'production' ? false : true
  });

  // React.useEffect(() => {
  //   // Reconnect the session when the user returns to the dApp
  //   reconnectProviders(walletProvider);
  // }, [walletProvider]);

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
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </UserContextProvider>
    </WalletProvider>
  );
};
