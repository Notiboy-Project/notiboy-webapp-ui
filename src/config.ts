

export const storageKey = {
  ACCESS_TOKEN_KEY: 'access_token',
  WALLET_ADDRESS_KEY: 'txnlab-use-wallet',
  USER_DATA_KEY: 'current-user'
}

export const routes = Object.freeze({
  connectWallet: '/connect-wallet',
  notifications: '/notifications',
  settings: '/settings',
  channels: '/channels',
  statistics: '/statistics',
  support: '/support',
  send: '/send',
  home: '/'
})


export const envs = Object.freeze({
  baseUrl: process.env.REACT_APP_BASE_URL,
  apiVersion: process.env.REACT_APP_API_VERSION,
  discordClientId: process.env.REACT_APP_DISCORD_CLIENT_ID,
  discordPublicKey: process.env.REACT_APP_DISCORD_PUBLIC_KEY,
  discordRedirectUrl: process.env.REACT_APP_DISCORD_REDIRECT_URL,
  discordAuthUrl: process.env.REACT_APP_DISCORD_AUTH_URL
  
})
