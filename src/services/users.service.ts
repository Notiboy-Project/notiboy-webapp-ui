import { Fetcher } from 'swr';
import api, { apiURL } from './api.service';
import { UsersPatFetcher, updateMediumPayload } from './services.types';

export const fetchUserInfo = async (chain: string, address: string) => {
  const resp = await api.get(apiURL.getUserInfoUrl(chain, address));
  return resp.data;
};

export const verifyEmail = async (
  chain: string,
  address: string,
  email: string
) => {
  const resp = await api.post(apiURL.verifyMediumUrl(chain, address, 'email'), {
    medium_address: email
  });
  return resp.data;
};

export const updateMediums = async (
  chain: string,
  address: string,
  payload: updateMediumPayload
) => {
  const resp = await api.put(apiURL.profileUpdateUrl(chain, address), payload);
  return resp?.data;
};

export const createAccesskey = async (
  chain: string,
  address: string,
  name: string
) => {
  const resp = await api.post(apiURL.createPat(chain, address, name));
  return resp?.data;
};

export const fetchAccessKeyPat: Fetcher<
  UsersPatFetcher,
  { chain: string; address: string }
> = async (args) => {
  const { chain, address } = args;
  const resp = await api.get(apiURL.getPat(chain, address));
  return resp?.data;
};
