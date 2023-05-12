import { storageKey } from '../config';

export const getTokenFromStorage = () => {
  return localStorage.getItem(storageKey.ACCESS_TOKEN_KEY) || null;
};

export const storeTokenToStorage = (token: string) => {
  localStorage.setItem(storageKey.ACCESS_TOKEN_KEY, token);
};

export const getWalletAddressFromStorage = () => {
  const str = localStorage.getItem(storageKey.WALLET_ADDRESS_KEY) || 'null';
  const wallet = JSON.parse(str);  
  console.log('wallet', wallet)
  const { activeAccount = null } = wallet?.state || {}
  console.log('activeAccount', activeAccount)
  if(activeAccount) {
    return activeAccount?.address || null
  }
  return null;
}