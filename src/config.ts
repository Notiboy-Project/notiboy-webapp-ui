

export const storageKey = {
  ACCESS_TOKEN_KEY: 'access_token',
  WALLET_ADDRESS_KEY: 'txnlab-use-wallet'
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
  apiVersion: process.env.REACT_APP_API_VERSION
})
