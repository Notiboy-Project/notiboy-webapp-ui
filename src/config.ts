export const storageKey = {
  ACCESS_TOKEN_KEY: 'access_token',
  WALLET_ADDRESS_KEY: 'txnlab-use-wallet',
  USER_DATA_KEY: 'current-user',
  XUMM_DATA_KEY: 'XummPkceJwt',
  X_USER_ADDRESS: 'X-USER-ADDRESS'
};

export const routes = Object.freeze({
  connectWallet: '/connect-wallet',
  notifications: '/notifications',
  scheduledNotifications: '/scheduled-notifications',
  settings: '/settings',
  channels: '/channels',
  statistics: '/statistics',
  support: '/support',
  send: '/send',
  home: '/',
  logout: '/logout',
  advanced: '/advanced'
});

export const envs = Object.freeze({
  baseUrl: process.env.REACT_APP_BASE_URL,
  apiVersion: process.env.REACT_APP_API_VERSION,
  discordClientId: process.env.REACT_APP_DISCORD_CLIENT_ID,
  discordRedirectUrl: process.env.REACT_APP_DISCORD_REDIRECT_URL,
  discordAuthUrl: process.env.REACT_APP_DISCORD_AUTH_URL,
  websocketUrl: process.env.REACT_APP_WEB_SOCKET_URL,
  walletConnectProjectId: process.env.REACT_APP_WC_PROJECT_ID,
  algorandNodeUrl: process.env.REACT_APP_ALGORAND_NODE_URL,
  algorandAssetIndex: process.env.REACT_APP_ALGORAND_ASSET_INDEX,
  destinationAddress: process.env.REACT_APP_DESTINATION_ADDRESS,
  xummApiKey: process.env.REACT_APP_XUMM_API_KEY,
  xrplDestinationAddress: process.env.REACT_APP_XRPL_DESTINATION_ADDRESS
});

export const pageSize = Object.freeze({
  notifications: 200,
  channels: 20
});
