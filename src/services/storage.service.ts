import { storageKey } from '../config';

export const getTokenFromStorage = () => {
  return localStorage.getItem(storageKey.ACCESS_TOKEN_KEY) || null;
};

export const storeTokenToStorage = (token: string) => {
  localStorage.setItem(storageKey.ACCESS_TOKEN_KEY, token);
};

export const storeAddressToStorage = (addr: string) => {
  localStorage.setItem(storageKey.X_USER_ADDRESS, addr);
}

export const removeTokenFromStorage = () => {
  localStorage.removeItem(storageKey.ACCESS_TOKEN_KEY);
};

export const removeUserAddressFromStorage = () => {
  localStorage.removeItem(storageKey.X_USER_ADDRESS);
}

export const removeCurrentUser = () => {
  localStorage.removeItem(storageKey.USER_DATA_KEY);
}

export const clearLocalStorage = () => {
  localStorage.clear()
}

export const getWalletAddressFromStorage = () => {
  const str = localStorage.getItem(storageKey.X_USER_ADDRESS) || 'null';
  if (str) return str

  return null;
};
