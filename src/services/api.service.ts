import axios from 'axios';
import { envs, routes } from '../config';
import {
  clearLocalStorage,
  getTokenFromStorage,
  getWalletAddressFromStorage
} from './storage.service';

const baseURL = envs.baseUrl + '/' + envs.apiVersion;

const api = axios.create({
  baseURL: envs.baseUrl + '/' + envs.apiVersion
});

export const loginToApp = (
  transactionStr: string,
  chain: string,
  address: string
) => {
  return axios.post(
    apiURL.login(chain, address),
    {},
    {
      headers: {
        'X-SIGNED-TXN': transactionStr,
        'X-USER-ADDRESS': address
      }
    }
  );
};

api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getTokenFromStorage()}`;
    config.headers['X-USER-ADDRESS'] = getWalletAddressFromStorage();
    return config;
  },
  (err) => {
    console.log('Error calling API', err);
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    // console.log('Response', response);
    return response;
  },
  (err) => {
    const { data } = err?.response;
    if (data?.status_code === 401) {
      clearLocalStorage();
      window.location.href = routes.connectWallet;
    }
    return Promise.reject(err);
  }
);

export const apiURL = {
  // USERS URL

  login: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}/login`, // POST
  profileUpdateUrl: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}`, // PUT
  userOnBoardingUrl: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}`, // POST
  userOffBoardingUrl: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}`, // DELETE

  getUserInfoUrl: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}`, // GET

  logoutUserUrl: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/users/${address}/logout`, // DELETE

  //NOTIFICATIONS URL

  fetchnotificationUrl: (chain: string) =>
    `${baseURL}/chains/${chain}/notifications`, // GET

  sendNotificationUrl: (chain: string, appId: string, kind: string) =>
    `${baseURL}/chains/${chain}/channels/${appId}/notifications/${kind}`, // POST

  // CHANNELS URLS

  createChannelURL: (chain: string) => `${baseURL}/chains/${chain}/channels`, // POST

  channelListsURL: (chain: string) =>
    `${baseURL}/chains/${chain}/channels?logo=true&limit=5000`, // GET

  channelsByUsersURL: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/channels/users/${address}/owned`, // GET

  channelsByOptedIn: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/channels/users/${address}/optins`, // GET

  channelsByOwned: (chain: string, address: string) =>
    `${baseURL}/chains/${chain}/channels/users/${address}/owned`, // GET

  channelUsersListsUrl: (chain: string, channel: string) =>
    `${baseURL}/chains/${chain}/channels/${channel}/users`, // GET

  updateChannelUrl: (chain: string, appId: string) =>
    `${baseURL}/chains/${chain}/channels/${appId}`, // PUT

  deleteChannelUrl: (chain: string, appId: string) =>
    `${baseURL}/chains/${chain}/channels/${appId}`, // DELETE
  // OPT-in OPT-out URLS

  channelOptInUrl: (chain: string, appId: string, address: string) =>
    `${baseURL}/chains/${chain}/channels/${appId}/users/${address}/optin`, // POST

  channelOptOutUrl: (chain: string, appId: string, address: string) =>
    `${baseURL}/chains/${chain}/channels/${appId}/users/${address}/optout`, // DELETE

  // VERIFICATION MEDIUM

  verifyMediumUrl: (chain: string, address: string, medium: string) =>
    `${baseURL}/chains/${chain}/user/${address}/verification/mediums/${medium}`, // GET

  // STATISTICS API URLS (ALL GET METHODS)

  getGlobalStatsUrl: () => `${baseURL}/stats/global`,

  getUsersStatsUrl: (chain: string) => `${baseURL}/chains/${chain}/stats/users`,

  getChannelStatUrl: (chain: string) =>
    `${baseURL}/chains/${chain}/stats/channels`,

  getOptinOutStatUrl: (chain: string, channel: string) =>
    `${baseURL}/chains/${chain}/stats/channels/${channel}/optinout`,

  getChnnelTractionsStatUrl: (
    chain: string,
    channel: string,
    address: string
  ) =>
    `${baseURL}/chains/${chain}/stats/channels/${channel}/users/${address}/notification`,

  getNotificationReachStatUrl: (
    chain: string,
    channel: string,
    address: string,
    kind: string,
    uuid: string
  ) =>
    `${baseURL}/chains/${chain}/stats/channels/${channel}/users/${address}/notification/${kind}/uuid/${uuid}?time`
};

export default api;
