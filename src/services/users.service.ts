import { Fetcher } from 'swr';
import api, { apiURL } from './api.service';
import {
  MembershipDataResonse,
  UserBillingResponse,
  UsersPatFetcher,
  updateMediumPayload
} from './services.types';
import { NetworkType } from '../pages/ConnectWallet/wallet.types';

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
  const resp = await api.post(apiURL.createPat(chain, address, name), {
    description: 'Normal key access API.'
  });
  return resp?.data;
};

export const revokeAccessKey = async (
  chain: string,
  address: string,
  keyId: string
) => {
  const resp = await api.delete(apiURL.deletePatURL(chain, address, keyId));
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

export const fetchBillingInfo: Fetcher<
  UserBillingResponse,
  { chain: string; user: string }
> = async (args) => {
  const { chain, user } = args;
  const resp = await api.get(apiURL.getBillingInfoURL(chain, user));
  return resp?.data;
};

export const fetchPlansDetails: Fetcher<MembershipDataResonse> = async () => {
  const resp = await api.get(apiURL.getPlansDetailsURL());
  return resp?.data;
};

export const switchPlan = async (
  chain: string,
  address: string,
  plan: string
) => {
  const resp = await api.put(apiURL.changeMembership(chain, address), {
    membership: plan
  });
  return resp?.data;
};

export const addBalance = async (
  chain: string,
  address: string,
  signed_txn: string
) => {
  let payload;
  if (chain === NetworkType.XRPL) {
    payload = { txn_id: signed_txn };
  }
  if (chain === NetworkType.ALGORAND) {
    payload = { signed_txn };
  }

  const resp = await api.post(apiURL.addFundURL(chain, address), {
    ...payload,
  });
  return resp?.data;
};
