import axios from 'axios';
import { envs } from '../config';
import { getTokenFromStorage, getWalletAddressFromStorage } from './storage.service';

const baseURL = envs.baseUrl + '/' + envs.apiVersion;

const api = axios.create({
  baseURL: envs.baseUrl + '/' + envs.apiVersion,
});

export const loginToApp = (transactionStr: string, chain: string, address: string) => {
  return axios.post(apiURL.login(chain, address), {
    signed_txn: transactionStr
  })
}

api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getTokenFromStorage()}`;
    config.headers['X-USER-ADDRESS'] = getWalletAddressFromStorage()
    return config;
  },
  (err) => {
    console.log('Error calling API', err);
    return Promise.reject(err);
  }
);

export const apiURL = {
  login: (chain: string, address: string) => `${baseURL}/chains/${chain}/users/${address}/login`,
  notification: (chain: string) => `${baseURL}/chains/${chain}/notifications`
}

export default api;
