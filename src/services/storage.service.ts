import { storageKey } from '../config';

export const getTokenFromStorage = () => {
  return localStorage.getItem(storageKey.ACCESS_TOKEN_KEY) || null;
};

export const storeTokenToStorage = (token: string) => {
  localStorage.setItem(storageKey.ACCESS_TOKEN_KEY, token);
};

export const removeTokenFromStorage = () => {
  localStorage.removeItem(storageKey.ACCESS_TOKEN_KEY);
};

export const removeCurrentUser = () => {
  localStorage.removeItem(storageKey.USER_DATA_KEY);
}

export const clearLocalStorage = () => {
  localStorage.clear()
}

export const getWalletAddressFromStorage = () => {
  const str = localStorage.getItem(storageKey.WALLET_ADDRESS_KEY) || 'null';
  const wallet = JSON.parse(str);
  const { activeAccount = null } = wallet?.state || {};
  if (activeAccount) {
    return activeAccount?.address || null;
  }
  return null;
};
